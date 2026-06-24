from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Brand, Product, Review
from .serializers import (
    CategorySerializer, BrandSerializer, 
    ProductListSerializer, ProductDetailSerializer,
    ReviewSerializer, ReviewCreateSerializer
)

class CategoryListView(generics.ListAPIView):
    """
    Список категорий (только корневые)
    """
    queryset = Category.objects.filter(parent__isnull=True, is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class BrandListView(generics.ListAPIView):
    """
    Список брендов
    """
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]


class ProductListView(generics.ListAPIView):
    """
    Список товаров с фильтрацией и пагинацией
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'pet_type', 'is_new', 'is_bestseller']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']


class ProductDetailView(generics.RetrieveAPIView):
    """
    Детальная информация о товаре
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ReviewListView(generics.ListAPIView):
    """
    Список отзывов на товар
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return Review.objects.filter(product_id=product_id, moderation_status='approved')


class ReviewCreateView(generics.CreateAPIView):
    """
    Создание отзыва
    """
    serializer_class = ReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)