from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('for-you/', views.enjoy, name='first'),
    path('only-for-you/', views.celeb, name='second'),
    path('save-data/', views.save_data, name='save_data'),
    # path('shared-lifafa/<uuid:pk>/', views.view_lifafa, name='view_lifafa'),

    # ... your existing sender paths
    path('unlock/loading/<str:secret_key>/', views.receiver_loading, name='receiver_loading'),
    path('unlock/envelope/<str:secret_key>/', views.receiver_envelope, name='receiver_envelope'),
    path('unlock/scrapbook/<str:secret_key>/', views.receiver_scrapbook, name='receiver_scrapbook'),
]
