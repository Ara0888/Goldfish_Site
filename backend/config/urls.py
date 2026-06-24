from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="Golden Fish API",
        default_version='v1',
        description="API для интернет-магазина Золотая рыбка",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="support@goldenfish.ru"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)


def home(request):
    return HttpResponse("""
        <h1>🐠 Добро пожаловать в Золотую рыбку!</h1>
        <p>API интернет-магазина работает.</p>
        <p>📚 <a href='/api/docs/'>Документация API (Swagger)</a></p>
        <p>🔧 <a href='/admin/'>Админка</a></p>
        <hr>
        <h3>Доступные эндпоинты:</h3>
        <ul>
            <li><b>/api/users/</b> - Регистрация, вход, профиль</li>
            <li><b>/api/catalog/</b> - Товары, категории, бренды</li>
            <li><b>/api/cart/</b> - Корзина и избранное</li>
            <li><b>/api/orders/</b> - Заказы и промокоды</li>
        </ul>
    """)

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    

    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    

    path('api/users/', include('apps.users.urls')),
    path('api/catalog/', include('apps.catalog.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/orders/', include('apps.orders.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)