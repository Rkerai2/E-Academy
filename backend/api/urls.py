from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

urlpatterns = [
    path('register/', register, name='register'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='get_token'),
    path('subjects/',subjectList,name='subjectList'),
    path('subject/<int:subject_id>/', subject_detail_view, name='subject-detail'),
    path('course/<int:course_id>/',course_detail_view,name='course_detail_view'),
    path('course/isenrolled/',getIsEnrolled,name='getIsEnrolled'),
    path('Courses/<int:course_id>/',Course_content,name='Course_content'),
    path('courses/<int:course_id>/reviews/', course_reviews, name='course_reviews'),
    path('courses/<int:course_id>/reviews/<int:review_id>/', course_reviews, name='delete_review'),
    path('Mylearning/', Mylearning, name='Mylearning'),
    path('search-courses/', search_courses, name='search_courses'),
    path('profile/', user_profile, name='user_profile'),
    path('profile/change-password/', change_password, name='change_password'),
    path('enrollcourse/<int:course_id>/', enroll_course, name='enroll-course'),
  
] 