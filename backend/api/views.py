from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth import login
from rest_framework import status
from django.db.models import Q
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from rest_framework.response import Response
from .serializers import *
from django.http import JsonResponse
from .models import Course,Subject
import smtplib
from email.mime.text import MIMEText
from django.conf import settings
from email.mime.multipart import MIMEMultipart
import os


# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'detail': 'User registered successfully!'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def subjectList(request):
    subjects = Subject.objects.all()
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def subject_detail_view(request, subject_id):
    try:
        subject = Subject.objects.get(id=subject_id)
    except Subject.DoesNotExist:
        return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = SubjectSerializer(subject)
    return Response(serializer.data)


# To send Mail
def send_email(recipient_email, subject, body):
    # SMTP server details
    smtp_server = "smtp.gmail.com"
    try:
        file_path = os.path.join(settings.BASE_DIR, 'api', 'smtp.txt')
        with open(file_path, 'r') as file:
            sender_email = file.readline()
            sender_password = file.readline()
        smtp_port = 587

        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = subject

        # Attach the body text to the email
        msg.attach(MIMEText(body, 'plain'))

        # Connect to the SMTP server and start TLS
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        print(f"Email successfully sent to {recipient_email}")

    except Exception as e:
        print(f"Error sending email: {e}")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_course(request, course_id):
    course = Course.objects.get(id=course_id)
    user = request.user

    if user not in course.enrolled_user.all():
        course.enrolled_user.add(user)
        course.save()
        subject = 'Course Enrollment Successful'
        body = f"Dear {user.name},\n\nYou have successfully enrolled in the course: {course.name}.\n\nBest regards,\n Ecademy Team"
        send_email(user.email, subject, body)  # Send email using your send_email function
        return Response({'status': 'enrolled'}, status=200)
    else:
        return Response({'status': 'already_enrolled'}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def search_courses(request):
    query = request.GET.get('q', '').strip() 
    if query:
        courses = Course.objects.filter(Q(name__icontains=query))  
    else: 
        courses = Course.objects.all()

    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)    

@api_view(['GET'])
@permission_classes([AllowAny])
def course_detail_view(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        subject = course.subject  # Fetch the subject of the course
        RecommendedCourse = Course.objects.filter(subject=subject).exclude(id=course_id)

    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CourseSerializer(course)
    RecommendedCourse_serializer = CourseSerializer(RecommendedCourse, many=True)
    
    return Response({
        'course': serializer.data,
        'RecommendedCourse': RecommendedCourse_serializer.data,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Course_content(request,course_id):  
    try:
        course = Course.objects.get(id=course_id) 
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)        
    
    serializer = CourseSerializer(course)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getIsEnrolled(request):
    data = request.data
    user = request.user
    try:
        course = Course.objects.get(id=data['course'])
    except Course.DoesNotExist:
        return Response({'error':"Course not found"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'isEnrolled':user in course.enrolled_user.all()}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Mylearning(request):
    user = request.user
    try:
       courses = Course.objects.filter(enrolled_user__in=[user])
    except  Course.DoesNotExist:
       return Response({'error':"Course not found"}, status=status.HTTP_400_BAD_REQUEST)
       
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def course_reviews(request, course_id, review_id=None):
    # Fetch reviews for the course (GET)
    if request.method == 'GET':
        reviews = Review.objects.filter(course__id=course_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    # Add a new review (POST)
    elif request.method == 'POST':
        data = request.data
        course = Course.objects.get(id=course_id)
        review = Review.objects.create(
            course=course,
            reviewer=request.user,
            stars=data['stars'],
            text=data.get('text', '')
        )
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Delete a review (DELETE)
    elif request.method == 'DELETE' and review_id:
        review = Review.objects.filter(id=review_id, reviewer=request.user).first()
        if review:
            review.delete()
            return Response({'message': 'Review deleted'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Review not found or you do not have permission to delete this review'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    # Check old password
    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    # Update session so user doesn't get logged out
    update_session_auth_hash(request, user)
    return Response({"message": "Password updated successfully"})    

