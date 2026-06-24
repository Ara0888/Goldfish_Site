from django.db import models
from apps.users.models import PetType

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=100, unique=True, verbose_name='URL')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, 
                               related_name='children', verbose_name='Родительская категория')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    image = models.ImageField(upload_to='categories/', blank=True, null=True, verbose_name='Изображение')
    is_active = models.BooleanField(default=True, verbose_name='Активна')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']
    
    def __str__(self):
        if self.parent:
            return f"{self.parent.name} → {self.name}"
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=100, unique=True, verbose_name='URL')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    logo = models.ImageField(upload_to='brands/', blank=True, null=True, verbose_name='Логотип')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    
    class Meta:
        db_table = 'brands'
        verbose_name = 'Бренд'
        verbose_name_plural = 'Бренды'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Product(models.Model):
    UNIT_CHOICES = (
        ('pcs', 'Штука'),
        ('kg', 'Килограмм'),
        ('g', 'Грамм'),
        ('l', 'Литр'),
        ('ml', 'Милллилитр'),
    )
    
    title = models.CharField(max_length=200, verbose_name='Название')
    slug = models.SlugField(max_length=200, unique=True, verbose_name='URL')
    description = models.TextField(verbose_name='Описание')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='products')
    
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, 
                                         verbose_name='Цена со скидкой')
    
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='pcs', verbose_name='Единица измерения')
    weight = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True, 
                                 verbose_name='Вес/объем')
    stock_quantity = models.PositiveIntegerField(default=0, verbose_name='Количество на складе')
    
    pet_type = models.ForeignKey('users.PetType', on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='products', verbose_name='Тип питомца')
    pet_age_group = models.CharField(max_length=50, blank=True, null=True, verbose_name='Возрастная группа')
    
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    is_new = models.BooleanField(default=False, verbose_name='Новинка')
    is_bestseller = models.BooleanField(default=False, verbose_name='Хит продаж')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'products'
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def current_price(self):
        return self.discount_price if self.discount_price else self.price


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/', verbose_name='Изображение')
    is_primary = models.BooleanField(default=False, verbose_name='Главное изображение')
    alt_text = models.CharField(max_length=200, blank=True, null=True, verbose_name='Alt текст')
    
    class Meta:
        db_table = 'product_images'
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товаров'
    
    def __str__(self):
        return f"Изображение {self.product.title}"


class Review(models.Model):
    MODERATION_STATUS = (
        ('pending', 'На модерации'),
        ('approved', 'Одобрен'),
        ('rejected', 'Отклонен'),
    )
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)], verbose_name='Оценка')
    comment = models.TextField(verbose_name='Комментарий')
    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reviews'
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']
        unique_together = ['product', 'user']
    
    def __str__(self):
        return f"Отзыв {self.user.email} о {self.product.title}"