from rest_framework import serializers

from ..models import FileVersion

class FileVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileVersion
        fields = ['id', 'file_name', 'version_number', 'file']
        read_only_fields = ['file_name', 'version_number']
