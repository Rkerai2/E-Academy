# Generated by Django 5.1 on 2024-09-22 12:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_alter_video_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='video',
            name='Time',
        ),
        migrations.AddField(
            model_name='video',
            name='timing',
            field=models.FloatField(null=True),
        ),
    ]
