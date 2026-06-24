from django.db import models
from django.utils import timezone


class User(models.Model):
    User_ID = models.AutoField(primary_key=True, db_column='User_ID')
    User_FirstName = models.CharField(max_length=100, db_column='User_FirstName')
    User_LastName = models.CharField(max_length=100, db_column='User_LastName')
    Password_Hash = models.CharField(max_length=255, db_column='Password_Hash') # В продакшене использовать AbstractUser
    Email = models.EmailField(unique=True, db_column='Email')
    Role = models.CharField(max_length=50, default='client', db_column='Role') # client, editor, manager
    Is_Active = models.BooleanField(default=True, db_column='Is_Active')
    Time_Created = models.DateTimeField(auto_now_add=True, db_column='Time_Created')

    class Meta:
        db_table = 'User'

class Client_Profile(models.Model):
    Client_ID = models.AutoField(primary_key=True, db_column='Client_ID')
    User_ID = models.ForeignKey(User, on_delete=models.CASCADE, db_column='User_ID', related_name='profiles')
    Phone = models.CharField(max_length=20, db_column='Phone')
    Client_Type = models.CharField(max_length=50, db_column='Client_Type') # физическое лицо / организация
    Organization_Name = models.CharField(max_length=255, blank=True, null=True, db_column='Organization_Name')
    Bonus_Balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='Bonus_Balance')

    class Meta:
        db_table = 'Client_Profile'

class Address(models.Model):
    Address_ID = models.AutoField(primary_key=True, db_column='Address_ID')
    Client_ID = models.ForeignKey(Client_Profile, on_delete=models.CASCADE, db_column='Client_ID', related_name='addresses')
    Region = models.CharField(max_length=100, db_column='Region')
    City = models.CharField(max_length=100, db_column='City')
    Street = models.CharField(max_length=100, db_column='Street')
    House = models.CharField(max_length=20, db_column='House')
    Apartment = models.CharField(max_length=20, blank=True, null=True, db_column='Apartment')

    class Meta:
        db_table = 'Address'

class Pet_Type(models.Model):
    PetType_ID = models.AutoField(primary_key=True, db_column='PetType_ID')
    Type_Name = models.CharField(max_length=100, db_column='Type_Name')

    class Meta:
        db_table = 'Pet_Type'

class Breed(models.Model):
    Breed_ID = models.AutoField(primary_key=True, db_column='Breed_ID')
    PetType_ID = models.ForeignKey(Pet_Type, on_delete=models.CASCADE, db_column='PetType_ID', related_name='breeds')
    Breed_Name = models.CharField(max_length=100, db_column='Breed_Name')

    class Meta:
        db_table = 'Breed'

class Pet(models.Model):
    Pet_ID = models.AutoField(primary_key=True, db_column='Pet_ID')
    Client_ID = models.ForeignKey(Client_Profile, on_delete=models.CASCADE, db_column='Client_ID', related_name='pets')
    Breed_ID = models.ForeignKey(Breed, on_delete=models.SET_NULL, null=True, db_column='Breed_ID')
    Pet_Name = models.CharField(max_length=100, db_column='Pet_Name')
    Birth_Date = models.DateField(db_column='Birth_Date')
    Special_Needs = models.TextField(blank=True, null=True, db_column='Special_Needs')

    class Meta:
        db_table = 'Pet'


class Category(models.Model):
    Category_ID = models.AutoField(primary_key=True, db_column='Category_ID')
    Parent_ID = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, db_column='Parent_ID', related_name='subcategories')
    Category_Name = models.CharField(max_length=100, db_column='Category_Name')
    Category_Slug = models.SlugField(unique=True, db_column='Category_Slug')

    class Meta:
        db_table = 'Category'
        verbose_name_plural = 'Categories'

class Brand(models.Model):
    Brand_ID = models.AutoField(primary_key=True, db_column='Brand_ID')
    Brand_Name = models.CharField(max_length=100, db_column='Brand_Name')
    Brand_Slug = models.SlugField(unique=True, db_column='Brand_Slug')

    class Meta:
        db_table = 'Brand'

class Product(models.Model):
    Product_ID = models.AutoField(primary_key=True, db_column='Product_ID')
    Brand_ID = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, db_column='Brand_ID', related_name='products')
    Product_Title = models.CharField(max_length=255, db_column='Product_Title')
    Product_Description = models.TextField(db_column='Product_Description')
    Standard_Price = models.DecimalField(max_digits=10, decimal_places=2, db_column='Standard_Price')
    Discount_Price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, db_column='Discount_Price')

    class Meta:
        db_table = 'Product'

class ProductCategory(models.Model):
    ProductCategory_ID = models.AutoField(primary_key=True, db_column='ProductCategory_ID')
    Product_ID = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='Product_ID')
    Category_ID = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='Category_ID')

    class Meta:
        db_table = 'ProductCategory'
        unique_together = ('Product_ID', 'Category_ID')

class Product_Image(models.Model):
    ProductImage_ID = models.AutoField(primary_key=True, db_column='ProductImage_ID')
    Product_ID = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='Product_ID', related_name='images')
    Image_Path = models.ImageField(upload_to='products/', db_column='Image_Path')
    Primary_Image = models.BooleanField(default=False, db_column='Primary_Image')

    class Meta:
        db_table = 'Product_Image'

class Cart(models.Model):
    Cart_ID = models.AutoField(primary_key=True, db_column='Cart_ID')
    Client_ID = models.ForeignKey(Client_Profile, on_delete=models.CASCADE, db_column='Client_ID', related_name='carts')
    Cart_CreatedAt = models.DateTimeField(auto_now_add=True, db_column='Cart_CreatedAt')
    Cart_UpdatedAt = models.DateTimeField(auto_now=True, db_column='Cart_UpdatedAt')
    Cart_Status = models.CharField(max_length=50, default='active', db_column='Cart_Status')

    class Meta:
        db_table = 'Cart'

class CartItem(models.Model):
    CartItem_ID = models.AutoField(primary_key=True, db_column='CartItem_ID')
    Cart_ID = models.ForeignKey(Cart, on_delete=models.CASCADE, db_column='Cart_ID', related_name='items')
    Product_ID = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='Product_ID')
    CartItem_Quantity = models.PositiveIntegerField(default=1, db_column='CartItem_Quantity')

    class Meta:
        db_table = 'CartItem'


class Review(models.Model):
    Review_ID = models.AutoField(primary_key=True, db_column='Review_ID')
    Product_ID = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='Product_ID', related_name='reviews')
    Client_ID = models.ForeignKey(Client_Profile, on_delete=models.CASCADE, db_column='Client_ID')
    Rating = models.IntegerField(db_column='Rating') # 1-5
    Comment = models.TextField(db_column='Comment')
    Moderation_Status = models.CharField(max_length=50, default='pending', db_column='Moderation_Status') # pending, published, rejected
    Review_TimeCreated = models.DateTimeField(auto_now_add=True, db_column='Review_TimeCreated')

    class Meta:
        db_table = 'Review'


class Promocode(models.Model):
    Promocode_ID = models.AutoField(primary_key=True, db_column='Promocode_ID')
    Code = models.CharField(max_length=50, unique=True, db_column='Code')
    Discount_Type = models.CharField(max_length=20, db_column='Discount_Type') # percent, fixed
    Discount_Value = models.DecimalField(max_digits=10, decimal_places=2, db_column='Discount_Value')
    Valid_From = models.DateTimeField(db_column='Valid_From')
    Valid_To = models.DateTimeField(db_column='Valid_To')
    Usage_Limit = models.IntegerField(db_column='Usage_Limit')
    Used_Count = models.IntegerField(default=0, db_column='Used_Count')
    Promocode_IsActive = models.BooleanField(default=True, db_column='Promocode_IsActive')

    class Meta:
        db_table = 'Promocode'

class Order(models.Model):
    Order_ID = models.AutoField(primary_key=True, db_column='Order_ID')
    Client_ID = models.ForeignKey(Client_Profile, on_delete=models.CASCADE, db_column='Client_ID', related_name='orders')
    Promocode_ID = models.ForeignKey(Promocode, on_delete=models.SET_NULL, null=True, blank=True, db_column='Promocode_ID')
    Promo_Discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='Promo_Discount')
    Subscription_ID = models.ForeignKey('Subscription', on_delete=models.SET_NULL, null=True, blank=True, db_column='Subscription_ID')
    Address_Snapshot = models.JSONField(db_column='Address_Snapshot') # Снимок адреса
    Order_Status = models.CharField(max_length=50, default='new', db_column='Order_Status')
    Bonuses_Spent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='Bonuses_Spent')
    Bonuses_Earned = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='Bonuses_Earned')
    Delivery_Method = models.CharField(max_length=100, db_column='Delivery_Method')
    Delivery_Price = models.DecimalField(max_digits=10, decimal_places=2, db_column='Delivery_Price')
    Tracking_Number = models.CharField(max_length=100, blank=True, null=True, db_column='Tracking_Number')
    Delivery_InvoiceDate = models.DateTimeField(null=True, blank=True, db_column='Delivery_InvoiceDate')
    Total_Amount = models.DecimalField(max_digits=10, decimal_places=2, db_column='Total_Amount')
    Order_CreatedAt = models.DateTimeField(auto_now_add=True, db_column='Order_CreatedAt')
    Order_UpdatedAt = models.DateTimeField(auto_now=True, db_column='Order_UpdatedAt')

    class Meta:
        db_table = 'Order'

class OrderItem(models.Model):
    OrderItem_ID = models.AutoField(primary_key=True, db_column='OrderItem_ID')
    Order_ID = models.ForeignKey(Order, on_delete=models.CASCADE, db_column='Order_ID', related_name='order_items')
    Product_ID = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='Product_ID')
    ProductName_Snapshot = models.CharField(max_length=255, db_column='ProductName_Snapshot')
    Unit_Price = models.DecimalField(max_digits=10, decimal_places=2, db_column='Unit_Price')
    OrderItem_Quantity = models.PositiveIntegerField(db_column='OrderItem_Quantity')

    class Meta:
        db_table = 'OrderItem'

class Payment(models.Model):
    Payment_ID = models.AutoField(primary_key=True, db_column='Payment_ID')
    Order_ID = models.ForeignKey(Order, on_delete=models.CASCADE, db_column='Order_ID', related_name='payments')
    Payment_Status = models.CharField(max_length=50, db_column='Payment_Status') # success, error
    Payment_Method = models.CharField(max_length=50, db_column='Payment_Method')
    Amount = models.DecimalField(max_digits=10, decimal_places=2, db_column='Amount')
    GatewayTransaction_ID = models.CharField(max_length=255, blank=True, null=True, db_column='GatewayTransaction_ID')
    Payment_CreatedAt = models.DateTimeField(auto_now_add=True, db_column='Payment_CreatedAt')

    class Meta:
        db_table = 'Payment'


class InventoryBatch(models.Model):
    InventoryBatch_ID = models.AutoField(primary_key=True, db_column='InventoryBatch_ID')
    Product_ID = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='Product_ID', related_name='inventory_batches')
    Batch_Number = models.CharField(max_length=100, db_column='Batch_Number')
    InventoryBatch_Quantity = models.PositiveIntegerField(db_column='InventoryBatch_Quantity')
    Expiration_Date = models.DateField(db_column='Expiration_Date')
    Received_At = models.DateTimeField(auto_now_add=True, db_column='Received_At')

    class Meta:
        db_table = 'InventoryBatch'

class OrderItemStock(models.Model):
    OrderItemStock_ID = models.AutoField(primary_key=True, db_column='OrderItemStock_ID')
    OrderItem_ID = models.ForeignKey(OrderItem, on_delete=models.CASCADE, db_column='OrderItem_ID')
    InventoryBatch_ID = models.ForeignKey(InventoryBatch, on_delete=models.CASCADE, db_column='InventoryBatch_ID')
    Quantity = models.PositiveIntegerField(db_column='Quantity')

    class Meta:
        db_table = 'OrderItemStock'

class Subscription(models.Model):
    Subscription_ID = models.AutoField(primary_key=True, db_column='Subscription_ID')
    Product_ID = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='Product_ID')
    Address_ID = models.ForeignKey(Address, on_delete=models.CASCADE, db_column='Address_ID')
    Client_ID = models.ForeignKey(Client_Profile, on_delete=models.CASCADE, db_column='Client_ID', related_name='subscriptions')
    Interval_Days = models.IntegerField(db_column='Interval_Days')
    Subscription_Quantity = models.PositiveIntegerField(db_column='Subscription_Quantity')
    Next_DeliveryDate = models.DateField(db_column='Next_DeliveryDate')
    Discount_Percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, db_column='Discount_Percent')
    Payment_Token = models.CharField(max_length=255, db_column='Payment_Token')
    Subscription_IsActive = models.BooleanField(default=True, db_column='Subscription_IsActive')
    Paused_At = models.DateTimeField(null=True, blank=True, db_column='Paused_At')
    Subscription_CreatedAt = models.DateTimeField(auto_now_add=True, db_column='Subscription_CreatedAt')

    class Meta:
        db_table = 'Subscription'