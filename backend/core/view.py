from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import (
    Product, Category, Pet_Type, Pet, Cart, CartItem, 
    Review, Order, Promocode, Client_Profile
)
from .serializers import (
    ProductSerializer, CategorySerializer, PetTypeSerializer, PetSerializer,
    CartSerializer, CartItemSerializer, ReviewSerializer, OrderSerializer, PromocodeSerializer
)
from .services import create_order_from_cart, calculate_cart_total
from .permissions import IsEditor, IsClientOwner

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Каталог товаров (публичный доступ)"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        products = self.queryset.filter(Product_Title__icontains=query)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(Parent_ID__isnull=True) # Только корневые
    serializer_class = CategorySerializer

class PetTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """Справочник для каскадных выпадающих списков (п. 1.v.2)"""
    queryset = Pet_Type.objects.all()
    serializer_class = PetTypeSerializer

class PetViewSet(viewsets.ModelViewSet):
    """Управление питомцами (Личный кабинет)"""
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Клиент видит только своих питомцев
        client = get_object_or_404(Client_Profile, User_ID=self.request.user)
        return Pet.objects.filter(Client_ID=client)

    def perform_create(self, serializer):
        client = get_object_or_404(Client_Profile, User_ID=self.request.user)
        serializer.save(Client_ID=client)

class CartViewSet(viewsets.ViewSet):
    """Управление корзиной"""
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        client = get_object_or_404(Client_Profile, User_ID=request.user)
        cart, _ = Cart.objects.get_or_create(Client_ID=client, Cart_Status='active')
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        client = get_object_or_404(Client_Profile, User_ID=request.user)
        cart, _ = Cart.objects.get_or_create(Client_ID=client, Cart_Status='active')
        
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        item, created = CartItem.objects.get_or_create(
            Cart_ID=cart, Product_ID_id=product_id,
            defaults={'CartItem_Quantity': quantity}
        )
        if not created:
            item.CartItem_Quantity += quantity
            item.save()
            
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        """Оформление заказа (п. 1.v.3)"""
        client = get_object_or_404(Client_Profile, User_ID=request.user)
        address_snapshot = request.data.get('address')
        delivery_method = request.data.get('delivery_method', 'courier')
        delivery_price = request.data.get('delivery_price', 0)
        promo_code = request.data.get('promo_code')
        bonuses_spent = request.data.get('bonuses_spent', 0)

        try:
            order = create_order_from_cart(
                client, address_snapshot, delivery_method, 
                delivery_price, promo_code, bonuses_spent
            )
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        product_id = self.kwargs.get('product_pk')
        if product_id:
            return Review.objects.filter(Product_ID_id=product_id, Moderation_Status='published')
        return Review.objects.filter(Moderation_Status='published')

    def perform_create(self, serializer):
        client = get_object_or_404(Client_Profile, User_ID=self.request.user)
        serializer.save(Client_ID=client, Moderation_Status='pending')