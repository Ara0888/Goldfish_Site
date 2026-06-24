from django.utils import timezone
from decimal import Decimal
from .models import Cart, CartItem, Order, OrderItem, Promocode, Client_Profile, InventoryBatch

def calculate_cart_total(cart):
    """Считает сумму товаров в корзине"""
    total = Decimal('0.00')
    for item in cart.items.all():
        price = item.Product_ID.Discount_Price or item.Product_ID.Standard_Price
        total += price * item.CartItem_Quantity
    return total

def apply_promocode(cart_total, promo_code_str):
    """Проверяет и применяет промокод"""
    try:
        promo = Promocode.objects.get(Code=promo_code_str, Promocode_IsActive=True)
        now = timezone.now()
        if promo.Valid_From <= now <= promo.Valid_To and promo.Used_Count < promo.Usage_Limit:
            if promo.Discount_Type == 'percent':
                discount = cart_total * (promo.Discount_Value / Decimal('100.0'))
            else:
                discount = promo.Discount_Value
            return promo, min(discount, cart_total)
    except Promocode.DoesNotExist:
        pass
    return None, Decimal('0.00')

def create_order_from_cart(client_profile, address_snapshot, delivery_method, delivery_price, promo_code=None, bonuses_spent=Decimal('0.00')):
    """Создает заказ на основе корзины (п. 1.e.i Оформление и обработка заказа)"""
    cart = Cart.objects.filter(Client_ID=client_profile, Cart_Status='active').first()
    if not cart or not cart.items.exists():
        raise ValueError("Корзина пуста")

    cart_total = calculate_cart_total(cart)
    promo, promo_discount = apply_promocode(cart_total, promo_code) if promo_code else (None, Decimal('0.00'))
    
    final_total = cart_total - promo_discount - bonuses_spent + delivery_price

    # Создание заказа
    order = Order.objects.create(
        Client_ID=client_profile,
        Promocode_ID=promo,
        Promo_Discount=promo_discount,
        Address_Snapshot=address_snapshot,
        Order_Status='new',
        Bonuses_Spent=bonuses_spent,
        Delivery_Method=delivery_method,
        Delivery_Price=delivery_price,
        Total_Amount=final_total
    )

    # Перенос товаров из корзины в заказ
    for item in cart.items.all():
        OrderItem.objects.create(
            Order_ID=order,
            Product_ID=item.Product_ID,
            ProductName_Snapshot=item.Product_ID.Product_Title,
            Unit_Price=item.Product_ID.Discount_Price or item.Product_ID.Standard_Price,
            OrderItem_Quantity=item.CartItem_Quantity
        )
        
        # Резервирование складских партий (упрощенно)
        batch = InventoryBatch.objects.filter(Product_ID=item.Product_ID, InventoryBatch_Quantity__gte=item.CartItem_Quantity).first()
        if batch:
            batch.InventoryBatch_Quantity -= item.CartItem_Quantity
            batch.save()

    # Начисление бонусов (например, 5% от суммы)
    bonuses_earned = final_total * Decimal('0.05')
    order.Bonuses_Earned = bonuses_earned
    order.save()

    client_profile.Bonus_Balance += bonuses_earned
    client_profile.Bonus_Balance -= bonuses_spent
    client_profile.save()

    # Очистка корзины
    cart.items.all().delete()
    cart.Cart_Status = 'completed'
    cart.save()

    if promo:
        promo.Used_Count += 1
        promo.save()

    return order