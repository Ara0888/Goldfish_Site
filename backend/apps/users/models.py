from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Клиент'),
        ('editor', 'Редактор'),
        ('admin', 'Администратор'),
    )
    
    email = models.EmailField(unique=True, verbose_name='Электронная почта')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Телефон')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client', verbose_name='Роль')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    bonus_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Бонусный баланс')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата регистрации')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class UserProfile(models.Model):
    CLIENT_TYPE_CHOICES = (
        ('individual', 'Физическое лицо'),
        ('organization', 'Организация'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    client_type = models.CharField(max_length=20, choices=CLIENT_TYPE_CHOICES, default='individual')
    organization_name = models.CharField(max_length=200, blank=True, null=True)
    inn = models.CharField(max_length=12, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
    
    def __str__(self):
        return f"Профиль {self.user.email}"


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    region = models.CharField(max_length=100, verbose_name='Регион')
    city = models.CharField(max_length=100, verbose_name='Город')
    street = models.CharField(max_length=200, verbose_name='Улица')
    house = models.CharField(max_length=20, verbose_name='Дом')
    apartment = models.CharField(max_length=20, blank=True, null=True, verbose_name='Квартира')
    postal_code = models.CharField(max_length=10, blank=True, null=True, verbose_name='Индекс')
    is_default = models.BooleanField(default=False, verbose_name='По умолчанию')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'addresses'
        verbose_name = 'Адрес'
        verbose_name_plural = 'Адреса'
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        return f"{self.city}, {self.street} {self.house}"


class PetType(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=50, unique=True, verbose_name='URL')
    
    class Meta:
        db_table = 'pet_types'
        verbose_name = 'Тип питомца'
        verbose_name_plural = 'Типы питомцев'
    
    def __str__(self):
        return self.name


class Breed(models.Model):
    pet_type = models.ForeignKey(PetType, on_delete=models.CASCADE, related_name='breeds')
    name = models.CharField(max_length=100, verbose_name='Название породы')
    slug = models.SlugField(max_length=100, verbose_name='URL')
    
    class Meta:
        db_table = 'breeds'
        verbose_name = 'Порода'
        verbose_name_plural = 'Породы'
        unique_together = ['pet_type', 'name']
    
    def __str__(self):
        return f"{self.pet_type.name} - {self.name}"


class Pet(models.Model):
    GENDER_CHOICES = (
        ('male', 'Мальчик'),
        ('female', 'Девочка'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pets')
    pet_type = models.ForeignKey(PetType, on_delete=models.CASCADE, related_name='pets')
    breed = models.ForeignKey(Breed, on_delete=models.SET_NULL, null=True, blank=True, related_name='pets')
    name = models.CharField(max_length=100, verbose_name='Кличка')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, verbose_name='Пол')
    birth_date = models.DateField(verbose_name='Дата рождения')
    weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name='Вес (кг)')
    special_needs = models.TextField(blank=True, null=True, verbose_name='Особые потребности')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pets'
        verbose_name = 'Питомец'
        verbose_name_plural = 'Питомцы'
    
    def __str__(self):
        return f"{self.name} ({self.pet_type.name})"