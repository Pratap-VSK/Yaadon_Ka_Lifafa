from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('for-you/', views.enjoy, name='first'),
    path('only-for-you/', views.celeb, name='second'),
    path('save-data/', views.save_data, name='save_data'),
    path('shared-lifafa/<uuid:pk>/', views.view_lifafa, name='view_lifafa'),
]