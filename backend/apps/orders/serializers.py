from rest_framework import serializers
from .models import Promocode, Order, OrderItem, Payment
from apps.catalog.serializers import ProductListSerializer
from apps.users.serializers import AddressSerializer

class PromocodeSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Promocode
        fields = ['id', 'code', 'discount_type', 'discount_value', 'min_order_amount',
                  'valid_from', 'valid_to', 'is_active', 'is_valid']


class OrderItemSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source='product', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_detail', 'product_name', 'unit_price', 
                  'quantity', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address_detail = AddressSerializer(source='address', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'address', 'address_detail', 'address_snapshot',
                  'subtotal', 'delivery_price', 'discount_total', 'total_amount',
                  'bonuses_spent', 'bonuses_earned', 'delivery_method', 
                  'tracking_number', 'delivery_date', 'status', 'payment_status',
                  'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.Serializer):
    address_id = serializers.IntegerField(required=True)
    delivery_method = serializers.ChoiceField(choices=Order.DELIVERY_CHOICES)
    promocode_code = serializers.CharField(required=False, allow_blank=True)
    use_bonuses = serializers.BooleanField(default=False)
    comment = serializers.CharField(required=False, allow_blank=True)


class ApplyPromocodeSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)