from django.urls import path
from . import views

urlpatterns = [
    # 1. Sender Page
    path('for-you/', views.sender_page, name='first'),
    path('save-data/', views.save_data, name='save_data'),
    path('loading/<str:secret_key>/', views.loading_page, name='loading_page'),
    path('unlock/<str:secret_key>/', views.user_page, name='user_page'),
]