from django.db import models
from django.core.validators import MinValueValidator
from apps.users.models import User
from apps.catalog.models import Product

class Cart(models.Model):
    """
    Корзина пользователя
    """
    STATUS_CHOICES = (
        ('active', 'Активна'),
        ('abandoned', 'Брошена'),
        ('converted', 'Преобразована в заказ'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'carts'
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'
    
    def __str__(self):
        return f"Корзина {self.user.email}"
    
    @property
    def total_items(self):
        return self.items.aggregate(models.Sum('quantity'))['quantity__sum'] or 0
    
    @property
    def total_price(self):
        total = 0
        for item in self.items.select_related('product'):
            price = item.product.current_price
            total += price * item.quantity
        return total


class CartItem(models.Model):
    """
    Товар в корзине
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cart_items'
        verbose_name = 'Товар в корзине'
        verbose_name_plural = 'Товары в корзине'
        unique_together = ['cart', 'product']
    
    def __str__(self):
        return f"{self.product.title} x{self.quantity}"
    
    @property
    def total_price(self):
        return self.product.current_price * self.quantity


class Favorite(models.Model):
    """
    Избранное
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'favorites'
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранное'
        unique_together = ['user', 'product']
    
    def __str__(self):
        return f"{self.user.email} -> {self.product.title}"