from django.contrib import admin
from .models import (
    User, Client_Profile, Address, Pet_Type, Breed, Pet,
    Category, Brand, Product, ProductCategory, Product_Image,
    Cart, CartItem, Review, Order, OrderItem, Payment, Promocode,
    InventoryBatch, Subscription
)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('Product_ID', 'Product_Title', 'Standard_Price', 'Discount_Price', 'Brand_ID')
    search_fields = ('Product_Title',)
    list_filter = ('Brand_ID',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('Order_ID', 'Client_ID', 'Total_Amount', 'Order_Status', 'Order_CreatedAt')
    list_filter = ('Order_Status',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('Review_ID', 'Product_ID', 'Client_ID', 'Rating', 'Moderation_Status')
    list_filter = ('Moderation_Status',)
    actions = ['approve_reviews', 'reject_reviews']

    def approve_reviews(self, request, queryset):
        queryset.update(Moderation_Status='published')
    approve_reviews.short_description = "Опубликовать выбранные отзывы"

    def reject_reviews(self, request, queryset):
        queryset.update(Moderation_Status='rejected')
    reject_reviews.short_description = "Отклонить выбранные отзывы"

# Регистрация остальных моделей для полноты CRUD в админке
admin.site.register(User)
admin.site.register(Client_Profile)
admin.site.register(Address)
admin.site.register(Pet_Type)
admin.site.register(Breed)
admin.site.register(Pet)
admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(ProductCategory)
admin.site.register(Product_Image)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(OrderItem)
admin.site.register(Payment)
admin.site.register(Promocode)
admin.site.register(InventoryBatch)
admin.site.register(Subscription)