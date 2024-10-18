from django.contrib import admin
from .models import *


class What_You_Learn(admin.TabularInline):
    model=WhatYouLearn

class Module_Tab(admin.TabularInline):
    model=Module

class Video_Tab(admin.TabularInline):
    model=Video

class courseadmin(admin.ModelAdmin):
    inlines=[What_You_Learn,Module_Tab] 

class moduladmin(admin.ModelAdmin):
    inlines=[Video_Tab]    

# Register your models here.
admin.site.register(Subject)
admin.site.register(Course,courseadmin)
admin.site.register( WhatYouLearn)
admin.site.register( Module,moduladmin)
admin.site.register( Video)
admin.site.register(Review)




