from django.urls import path
from .views import (
    CartView, AddToCartView, UpdateCartItemView,
    RemoveFromCartView, ClearCartView,
    FavoriteListView, RemoveFavoriteView
)

app_name = 'cart'

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('add/', AddToCartView.as_view(), name='add-to-cart'),
    path('update/<int:item_id>/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('remove/<int:item_id>/', RemoveFromCartView.as_view(), name='remove-from-cart'),
    path('clear/', ClearCartView.as_view(), name='clear-cart'),
    path('favorites/', FavoriteListView.as_view(), name='favorites'),
    path('favorites/remove/<int:product_id>/', RemoveFavoriteView.as_view(), name='remove-favorite'),
]