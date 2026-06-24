from django.db import models
from apps.users.models import User, Address
from apps.catalog.models import Product

class Promocode(models.Model):
    """
    Промокод
    """
    DISCOUNT_TYPE_CHOICES = (
        ('percent', 'Процент'),
        ('fixed', 'Фиксированная сумма'),
    )
    
    code = models.CharField(max_length=50, unique=True, verbose_name='Код')
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPE_CHOICES, default='percent')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Значение скидки')
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                           verbose_name='Минимальная сумма заказа')
    valid_from = models.DateTimeField(verbose_name='Действует с')
    valid_to = models.DateTimeField(verbose_name='Действует до')
    usage_limit = models.PositiveIntegerField(default=1, verbose_name='Лимит использований')
    used_count = models.PositiveIntegerField(default=0, verbose_name='Использовано раз')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'promocodes'
        verbose_name = 'Промокод'
        verbose_name_plural = 'Промокоды'
    
    def __str__(self):
        return self.code
    
    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return (self.is_active and 
                self.valid_from <= now <= self.valid_to and 
                self.used_count < self.usage_limit)


class Order(models.Model):
    """
    Заказ
    """
    STATUS_CHOICES = (
        ('pending', 'Ожидает подтверждения'),
        ('confirmed', 'Подтвержден'),
        ('processing', 'В обработке'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменен'),
        ('refunded', 'Возвращен'),
    )
    
    DELIVERY_CHOICES = (
        ('courier', 'Курьером'),
        ('pickup', 'Самовывоз'),
        ('post', 'Почтой России'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    promocode = models.ForeignKey(Promocode, on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name='orders')
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, 
                                related_name='orders')
    
    address_snapshot = models.JSONField(verbose_name='Адрес доставки (снимок)', default=dict)
    promocode_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                             verbose_name='Скидка по промокоду')
    
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Подытог')
    delivery_price = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                         verbose_name='Стоимость доставки')
    discount_total = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                         verbose_name='Общая скидка')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Итого')
    
    bonuses_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                        verbose_name='Потрачено бонусов')
    bonuses_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                                         verbose_name='Начислено бонусов')
    
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_CHOICES, default='courier')
    tracking_number = models.CharField(max_length=100, blank=True, null=True, verbose_name='Трек-номер')
    delivery_date = models.DateField(null=True, blank=True, verbose_name='Дата доставки')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, default='unpaid', 
                                      choices=(('unpaid', 'Не оплачен'), 
                                              ('paid', 'Оплачен'),
                                              ('failed', 'Ошибка оплаты')))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'orders'
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Заказ #{self.id} - {self.user.email}"


class OrderItem(models.Model):
    """
    Товар в заказе
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, 
                                related_name='order_items')
    
    product_name = models.CharField(max_length=200, verbose_name='Название товара')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена за единицу')
    quantity = models.PositiveIntegerField(default=1, verbose_name='Количество')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Сумма')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'order_items'
        verbose_name = 'Товар в заказе'
        verbose_name_plural = 'Товары в заказе'
    
    def __str__(self):
        return f"{self.product_name} x{self.quantity}"


class Payment(models.Model):
    """
    Платеж
    """
    PAYMENT_METHOD_CHOICES = (
        ('card', 'Банковская карта'),
        ('cash', 'Наличные'),
        ('sberpay', 'SberPay'),
    )
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='card')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Сумма платежа')
    transaction_id = models.CharField(max_length=200, blank=True, null=True, verbose_name='ID транзакции')
    payment_status = models.CharField(max_length=20, default='pending',
                                      choices=(('pending', 'В обработке'),
                                              ('success', 'Успешно'),
                                              ('failed', 'Ошибка')))
    payment_data = models.JSONField(default=dict, blank=True, verbose_name='Данные платежа')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        verbose_name = 'Платеж'
        verbose_name_plural = 'Платежи'
    
    def __str__(self):
        return f"Платеж для заказа #{self.order.id}"