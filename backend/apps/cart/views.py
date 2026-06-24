from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Favorite
from apps.catalog.models import Product
from .serializers import (
    CartSerializer, CartItemSerializer,
    AddToCartSerializer, UpdateCartItemSerializer,
    FavoriteSerializer, AddFavoriteSerializer
)

class CartView(generics.RetrieveAPIView):
    """
    Получение корзины текущего пользователя
    """
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartView(APIView):
    """
    Добавление товара в корзину
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        
        product = get_object_or_404(Product, id=product_id, is_active=True)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return Response({
            'message': 'Товар добавлен в корзину',
            'cart_item': CartItemSerializer(cart_item).data
        }, status=status.HTTP_200_OK)


class UpdateCartItemView(APIView):
    """
    Обновление количества товара в корзине
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart_item.quantity = serializer.validated_data['quantity']
        cart_item.save()
        
        return Response({
            'message': 'Количество обновлено',
            'cart_item': CartItemSerializer(cart_item).data
        })


class RemoveFromCartView(APIView):
    """
    Удаление товара из корзины
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        cart_item.delete()
        
        return Response({
            'message': 'Товар удален из корзины'
        }, status=status.HTTP_200_OK)


class ClearCartView(APIView):
    """
    Очистка корзины
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        
        return Response({
            'message': 'Корзина очищена'
        }, status=status.HTTP_200_OK)


class FavoriteListView(generics.ListCreateAPIView):
    """
    Список избранного и добавление в избранное
    """
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = AddFavoriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data['product_id']
        product = get_object_or_404(Product, id=product_id, is_active=True)
        
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            product=product
        )
        
        if created:
            return Response({
                'message': 'Товар добавлен в избранное',
                'favorite': FavoriteSerializer(favorite).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'message': 'Товар уже в избранном'
            }, status=status.HTTP_200_OK)


class RemoveFavoriteView(APIView):
    """
    Удаление товара из избранного
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, product_id):
        favorite = get_object_or_404(Favorite, user=request.user, product_id=product_id)
        favorite.delete()
        
        return Response({
            'message': 'Товар удален из избранного'
        }, status=status.HTTP_200_OK)