# Generated by Django 5.1 on 2024-09-22 12:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_remove_video_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='text',
            field=models.TextField(default=1, max_length=200),
            preserve_default=False,
        ),
    ]
