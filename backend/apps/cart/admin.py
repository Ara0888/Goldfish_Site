from django.contrib import admin
from .models import Cart, CartItem, Favorite

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'total_items', 'total_price', 'updated_at')
    list_filter = ('status',)
    readonly_fields = ('total_items', 'total_price')


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity', 'total_price')


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')