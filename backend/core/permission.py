from rest_framework import permissions

class IsEditor(permissions.BasePermission):
    """Доступ только для Редакторов/Менеджеров (Админ-панель)"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.Role in ['editor', 'manager']

class IsClientOwner(permissions.BasePermission):
    """Клиент может редактировать только свои данные"""
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'User_ID'):
            return obj.User_ID == request.user
        if hasattr(obj, 'Client_ID'):
            return obj.Client_ID.User_ID == request.user
        return False