# Generated by Django 5.1 on 2024-09-22 12:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_video_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='text',
            field=models.TextField(default=1, max_length=200),
            preserve_default=False,
        ),
    ]
