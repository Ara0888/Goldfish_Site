from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from decimal import Decimal
from .models import Promocode, Order, OrderItem
from apps.cart.models import Cart
from apps.users.models import Address
from apps.catalog.models import Product
from .serializers import (
    PromocodeSerializer, OrderSerializer, 
    OrderCreateSerializer, ApplyPromocodeSerializer
)

class PromocodeListView(generics.ListAPIView):
    """
    Список активных промокодов
    """
    queryset = Promocode.objects.filter(is_active=True)
    serializer_class = PromocodeSerializer
    permission_classes = [permissions.AllowAny]


class ApplyPromocodeView(APIView):
    """
    Проверка и применение промокода
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ApplyPromocodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        code = serializer.validated_data['code']
        promocode = get_object_or_404(Promocode, code=code)
        
        if not promocode.is_valid():
            return Response({
                'error': 'Промокод недействителен или истек'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cart = get_object_or_404(Cart, user=request.user)
        cart_total = cart.total_price
        
        if promocode.min_order_amount and cart_total < promocode.min_order_amount:
            return Response({
                'error': f'Минимальная сумма заказа для промокода: {promocode.min_order_amount}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if promocode.discount_type == 'percent':
            discount = (cart_total * promocode.discount_value) / 100
        else:
            discount = promocode.discount_value
        
        return Response({
            'promocode': PromocodeSerializer(promocode).data,
            'discount': discount,
            'cart_total': cart_total,
            'new_total': cart_total - discount
        })


class OrderListView(generics.ListAPIView):
    """
    Список заказов пользователя
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """
    Детальная информация о заказе
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderCreateView(APIView):
    """
    Создание нового заказа из корзины
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Получаем корзину пользователя
        cart = get_object_or_404(Cart, user=request.user)
        
        if not cart.items.exists():
            return Response({
                'error': 'Корзина пуста'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        for item in cart.items.all():
            if item.product.stock_quantity < item.quantity:
                return Response({
                    'error': f'Недостаточно товара "{item.product.title}" на складе'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        address = get_object_or_404(Address, id=serializer.validated_data['address_id'], user=request.user)
        
        order = Order.objects.create(
            user=request.user,
            address=address,
            address_snapshot={
                'city': address.city,
                'street': address.street,
                'house': address.house,
                'apartment': address.apartment,
                'postal_code': address.postal_code
            },
            delivery_method=serializer.validated_data['delivery_method'],
            subtotal=cart.total_price,
            delivery_price=Decimal('0'),
            discount_total=Decimal('0'),
            total_amount=cart.total_price,
            status='pending'
        )
        
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.title,
                unit_price=cart_item.product.current_price,
                quantity=cart_item.quantity,
                total_price=cart_item.total_price
            )
            
            cart_item.product.stock_quantity -= cart_item.quantity
            cart_item.product.save()
        
        cart.items.all().delete()
        cart.status = 'converted'
        cart.save()
        
        return Response({
            'message': 'Заказ успешно создан',
            'order': OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)


class CancelOrderView(APIView):
    """
    Отмена заказа
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        
        if order.status not in ['pending', 'confirmed']:
            return Response({
                'error': 'Невозможно отменить заказ в текущем статусе'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        for item in order.items.all():
            if item.product:
                item.product.stock_quantity += item.quantity
                item.product.save()
        
        order.status = 'cancelled'
        order.save()
        
        return Response({
            'message': 'Заказ отменен'
        })