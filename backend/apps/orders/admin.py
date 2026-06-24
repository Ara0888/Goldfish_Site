from django.contrib import admin
from .models import Promocode, Order, OrderItem, Payment

@admin.register(Promocode)
class PromocodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'valid_from', 'valid_to', 'is_active')
    list_filter = ('is_active', 'discount_type')
    search_fields = ('code',)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('total_price',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status', 'delivery_method')
    search_fields = ('user__email', 'tracking_number')
    readonly_fields = ('subtotal', 'total_amount', 'created_at', 'updated_at')
    inlines = [OrderItemInline]

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'amount', 'payment_method', 'payment_status', 'created_at')
    list_filter = ('payment_status', 'payment_method')