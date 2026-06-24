from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, Review

class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'children', 'description', 'image']
    
    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        return CategorySerializer(children, many=True).data


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'alt_text']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'rating', 'comment', 'moderation_status', 'created_at']
        read_only_fields = ['id', 'user', 'moderation_status', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.full_name


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'category', 'category_name', 'brand', 'brand_name',
                  'price', 'discount_price', 'current_price', 'unit', 'stock_quantity',
                  'primary_image', 'is_new', 'is_bestseller']
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return primary.image.url
        first = obj.images.first()
        return first.image.url if first else None


class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'slug', 'description', 'category', 'category_name',
                  'brand', 'brand_name', 'price', 'discount_price', 'current_price',
                  'unit', 'weight', 'stock_quantity', 'images', 'reviews',
                  'pet_type', 'pet_age_group', 'is_active', 'is_new', 'is_bestseller',
                  'created_at']
    
    def get_reviews(self, obj):
        approved_reviews = obj.reviews.filter(moderation_status='approved')
        return ReviewSerializer(approved_reviews, many=True).data


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['product', 'rating', 'comment']
    
    def validate(self, attrs):
        user = self.context['request'].user
        if Review.objects.filter(product=attrs['product'], user=user).exists():
            raise serializers.ValidationError("Вы уже оставили отзыв на этот товар")
        return attrs
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)