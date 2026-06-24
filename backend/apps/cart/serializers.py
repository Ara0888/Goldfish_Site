from rest_framework import serializers
from .models import Cart, CartItem, Favorite
from apps.catalog.serializers import ProductListSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source='product', read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_detail', 'quantity', 'total_price']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'status', 'items', 'total_items', 'total_price', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class FavoriteSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source='product', read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'product', 'product_detail', 'created_at']


class AddFavoriteSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()