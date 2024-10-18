from rest_framework import serializers
from user.models import CustomUser
from .models import *
from django.contrib.auth import get_user_model, authenticate
UserModel = get_user_model()
from rest_framework.serializers import ValidationError

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['name','email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        user = authenticate(username=clean_data['email'], password=clean_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['email', 'name', 'password','user_profile_image','phone_number']
         
        extra_kwargs = {
            'email': {'required':False},
            'name': {'required':False},
            'password': {'required':False},
            'user_profile_image':{'required':False},
            'phone_number':{'required':False}
        }
    def create(self, validated_data):
        user = UserModel.objects.create_user(**validated_data)
        return user
    

class WhatYoulearnSerializer(serializers.ModelSerializer):
    class Meta:
        model=WhatYouLearn
        fields=['id','item']

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'video_url','srNo','preview','duration','Title']
        

# Module Serializer
class ModuleSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)  

    class Meta:
        model = Module
        fields = ['id', 'title', 'description','srNumber', 'videos']  

# Review Serializer
class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True) 

    class Meta:
        model = Review
        fields = ['id', 'course', 'reviewer', 'stars', 'text', 'created_at']              

class CourseSerializer(serializers.ModelSerializer):
    WhatLearn=WhatYoulearnSerializer(many=True,read_only=True)
    modules=ModuleSerializer(many=True,read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'description','course_image','enrolled_user','explanation','WhatLearn','modules']
        extra_kwargs = {
            "name":{"required":False},
            "description":{"required":False},
            "explanation":{"required":False},
            "course_image":{"required":False},
        }
        
 
class SubjectSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    class Meta:
        model = Subject
        fields = ['id', 'name', 'description', 'Subject_Image','courses','icon']          