from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('loading/', views.loading, name='loading'),
    path('logout/', views.logout_user, name='logout'),
]