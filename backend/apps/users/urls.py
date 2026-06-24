from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, AddressListCreateView, AddressDetailView, PetTypeListView, BreedListView, PetListCreateView, PetDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('addresses/', AddressListCreateView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
    path('pet-types/', PetTypeListView.as_view(), name='pet-type-list'),
    path('breeds/', BreedListView.as_view(), name='breed-list'),
    path('pets/', PetListCreateView.as_view(), name='pet-list'),
    path('pets/<int:pk>/', PetDetailView.as_view(), name='pet-detail'),
]