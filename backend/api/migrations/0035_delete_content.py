# Generated by Django 5.1 on 2024-09-27 16:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0034_alter_course_enrolled_user'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Content',
        ),
    ]
