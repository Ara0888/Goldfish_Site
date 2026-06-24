from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Address, PetType, Breed, Pet
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    AddressSerializer, PetTypeSerializer, BreedSerializer, PetSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        if serializer.validated_data.get('is_default'):
            Address.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class PetTypeListView(generics.ListAPIView):
    queryset = PetType.objects.all()
    serializer_class = PetTypeSerializer
    permission_classes = [permissions.AllowAny]


class BreedListView(generics.ListAPIView):
    serializer_class = BreedSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Breed.objects.all()
        pet_type_id = self.request.query_params.get('pet_type')
        if pet_type_id:
            queryset = queryset.filter(pet_type_id=pet_type_id)
        return queryset


class PetListCreateView(generics.ListCreateAPIView):
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Pet.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Pet.objects.filter(user=self.request.user)
    