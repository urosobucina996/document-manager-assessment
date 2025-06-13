import requests
import os
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.shortcuts import render

from rest_framework.mixins import (
    RetrieveModelMixin, ListModelMixin, CreateModelMixin, UpdateModelMixin
)
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from django.core.files.base import ContentFile
from rest_framework.exceptions import ValidationError

from django.http import FileResponse, HttpResponseForbidden, Http404
from rest_framework.decorators import action


from ..models import FileVersion
from .serializers import FileVersionSerializer

private_storage = FileSystemStorage(location=settings.PRIVATE_MEDIA_ROOT)

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
        path = os.path.join(folder, filename)

        saved_path = private_storage.save(path, ContentFile(uploaded_file.read()))

        serializer.save(
            user=self.request.user,
            file=saved_path,
            file_name=filename,
            version_number=version_number
        )

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'], url_path='download')
    def serve_file(self, request, id=None):
        try:
            file_version = self.get_queryset().get(id=id)
        except FileVersion.DoesNotExist:
            raise Http404("File not found.")

        if file_version.user != request.user:
            return HttpResponseForbidden("You do not have permission to access this file.")

        file_path = os.path.join(settings.PRIVATE_MEDIA_ROOT, file_version.file.name)

        if not os.path.exists(file_path):
            raise Http404("File does not exist.")

        return FileResponse(open(file_path, 'rb'))


