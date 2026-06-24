from django.urls import path
from .views import (
    CategoryListView, BrandListView,
    ProductListView, ProductDetailView,
    ReviewListView, ReviewCreateView
)

app_name = 'catalog'

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('brands/', BrandListView.as_view(), name='brands'),
    path('products/', ProductListView.as_view(), name='products'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:product_id>/reviews/', ReviewListView.as_view(), name='reviews'),
    path('reviews/create/', ReviewCreateView.as_view(), name='review-create'),
]