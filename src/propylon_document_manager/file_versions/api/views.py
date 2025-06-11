from django.shortcuts import render

from rest_framework.mixins import (
    RetrieveModelMixin, ListModelMixin, CreateModelMixin, UpdateModelMixin
)
from rest_framework.viewsets import GenericViewSet
from rest_framework.viewsets import GenericViewSet

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from ..models import FileVersion
from .serializers import FileVersionSerializer

class FileVersionViewSet(
    RetrieveModelMixin,
    ListModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    GenericViewSet
):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FileVersionSerializer
    queryset = FileVersion.objects.all()
    lookup_field = "id"

    def get_queryset(self):
        return FileVersion.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
