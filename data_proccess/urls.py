from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('for-you/', views.enjoy, name='first'),
    path('only-for-you/', views.celeb, name='second'),
]