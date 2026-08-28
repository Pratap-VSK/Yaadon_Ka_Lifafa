from django.shortcuts import render, redirect

def login(request):
    return render(request, 'accounts/authentication.html')

def loading(request):
    return render(request, 'accounts/loading.html')