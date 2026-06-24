from django.contrib import admin
from .models import Category, Brand, Product, ProductImage, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('is_active',)

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('is_active',)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'current_price', 'stock_quantity', 'is_active')
    list_filter = ('category', 'brand', 'is_active', 'is_new', 'is_bestseller')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProductImageInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'moderation_status', 'created_at')
    list_filter = ('moderation_status', 'rating')