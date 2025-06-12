import requests
import os
from django.core.files.storage import default_storage
from django.shortcuts import render

from rest_framework.mixins import (
    RetrieveModelMixin, ListModelMixin, CreateModelMixin, UpdateModelMixin
)
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from django.core.files.base import ContentFile
from rest_framework.exceptions import ValidationError

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
        print(self.request.data)
        folder, uploaded_file, version_number = (
            self.request.data.get('file_url', '').strip().strip('/'),
            self.request.FILES.get('file'),
            self.request.data.get('version_number')
        )

        if not uploaded_file:
            raise ValidationError("No file uploaded")

        if not folder:
            folder = 'default'

        filename = uploaded_file.name
        path = os.path.join(folder, filename)  # e.g. 'user_uploads/123/image.png'
        
        # Save the file manually to desired path
        saved_path = default_storage.save(path, ContentFile(uploaded_file.read()))

        serializer.save(
            user=self.request.user,
            file=saved_path,
            file_name=filename,
            version_number=version_number
        )

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
