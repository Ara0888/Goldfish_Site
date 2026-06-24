from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserProfile, Address, PetType, Breed, Pet

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'email', 'username', 'first_name', 'last_name', 'role', 'is_active')
    list_filter = ('role', 'is_active', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Личная информация', {'fields': ('username', 'first_name', 'last_name', 'phone')}),
        ('Права доступа', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Бонусы', {'fields': ('bonus_balance',)}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role'),
        }),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'client_type', 'organization_name')

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'city', 'street', 'house', 'is_default')

@admin.register(PetType)
class PetTypeAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Breed)
class BreedAdmin(admin.ModelAdmin):
    list_display = ('name', 'pet_type')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'pet_type', 'breed')