# Generated by Django 5.1 on 2024-09-22 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_video_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='module',
            name='srNumber',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='video',
            name='srNo',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
