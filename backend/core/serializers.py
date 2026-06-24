from rest_framework import serializers
from .models import (
    User, Client_Profile, Pet_Type, Breed, Pet, Category, Brand, 
    Product, Product_Image, Cart, CartItem, Review, Order, OrderItem, Promocode
)

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Image
        fields = ['ProductImage_ID', 'Image_Path', 'Primary_Image']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(source='images', many=True, read_only=True)
    brand_name = serializers.CharField(source='Brand_ID.Brand_Name', read_only=True)

    class Meta:
        model = Product
        fields = ['Product_ID', 'Product_Title', 'Product_Description', 
                  'Standard_Price', 'Discount_Price', 'brand_name', 'images']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['Category_ID', 'Category_Name', 'Category_Slug', 'Parent_ID']

class BreedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Breed
        fields = ['Breed_ID', 'Breed_Name', 'PetType_ID']

class PetTypeSerializer(serializers.ModelSerializer):
    breeds = BreedSerializer(many=True, read_only=True)
    class Meta:
        model = Pet_Type
        fields = ['PetType_ID', 'Type_Name', 'breeds']

class PetSerializer(serializers.ModelSerializer):
    breed_name = serializers.CharField(source='Breed_ID.Breed_Name', read_only=True)
    class Meta:
        model = Pet
        fields = '__all__'
        read_only_fields = ['Client_ID']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(source='Product_ID', read_only=True)
    class Meta:
        model = CartItem
        fields = ['CartItem_ID', 'product', 'CartItem_Quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source='items', many=True, read_only=True)
    class Meta:
        model = Cart
        fields = ['Cart_ID', 'Cart_Status', 'items']

class ReviewSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['Client_ID', 'Review_TimeCreated', 'Moderation_Status']

    def get_client_name(self, obj):
        return f"{obj.Client_ID.User_ID.User_FirstName} {obj.Client_ID.User_ID.User_LastName}"

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['Client_ID', 'Total_Amount', 'Order_CreatedAt', 'Bonuses_Earned']

class PromocodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promocode
        fields = '__all__'