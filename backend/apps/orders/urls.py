from django.urls import path
from .views import (
    PromocodeListView, ApplyPromocodeView,
    OrderListView, OrderDetailView, OrderCreateView, CancelOrderView
)

app_name = 'orders'

urlpatterns = [
    path('promocodes/', PromocodeListView.as_view(), name='promocodes'),
    path('promocodes/apply/', ApplyPromocodeView.as_view(), name='apply-promocode'),
    path('', OrderListView.as_view(), name='orders'),
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:order_id>/cancel/', CancelOrderView.as_view(), name='order-cancel'),
]