from django.db import models
from user.models import CustomUser


# Create your models here.
 
class Subject(models.Model):
    name = models.CharField(max_length=255)
    icon=models.ImageField(upload_to='Images/profiles/')
    Subject_Image = models.ImageField(upload_to='Images/profiles/')
    description = models.TextField()

    def __str__(self):
        return self.name 
    
# Course Model
class Course(models.Model):
    subject = models.ForeignKey(Subject, related_name='courses', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    explanation = models.TextField()
    course_image = models.ImageField(upload_to='Images/profiles/')
    enrolled_user = models.ManyToManyField(CustomUser, related_name='enrolled_user', blank=True)

    def __str__(self):
        return self.name    
    
# What you learn model

class WhatYouLearn(models.Model):
    course = models.ForeignKey(Course, related_name='WhatLearn', on_delete=models.CASCADE)
    item = models.CharField(max_length=255)

    def __str__(self):
        return self.item    
    
# Moduls Model
class Module(models.Model):
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE)
    srNumber=models.IntegerField(null=True)
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title    
    
#video model
class Video(models.Model):
    module = models.ForeignKey(Module, related_name='videos', on_delete=models.CASCADE)
    srNo=models.IntegerField(null=True)
    Title=models.TextField(null=True)
    video_url = models.CharField(max_length=200)
    preview=models.BooleanField(default=False)
    duration=models.FloatField(null=True)

    def __str__(self):
        return f"Video for {self.module.title}"  

# Review Model
class Review(models.Model):
    course = models.ForeignKey(Course, related_name='reviews', on_delete=models.CASCADE)
    reviewer = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    stars = models.IntegerField()
    text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.reviewer.name} - {self.stars} stars'      