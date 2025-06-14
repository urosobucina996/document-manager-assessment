# Generated by Django 5.0.1 on 2025-06-11 14:36

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("file_versions", "0002_alter_user_managers"),
    ]

    operations = [
        migrations.AddField(
            model_name="fileversion",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="file_versions",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
