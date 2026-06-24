from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, PetTypeViewSet, PetViewSet, CartViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'pet-types', PetTypeViewSet, basename='pet-types')
router.register(r'pets', PetViewSet, basename='pets')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'reviews', ReviewViewSet, basename='reviews')

urlpatterns = [
    path('api/', include(router.urls)),
]