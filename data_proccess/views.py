from django.shortcuts import render

def enjoy(request):
    return render(request, 'customization/for-you.html')

def celeb(request):
    return render(request, 'customization/only-for-you.html')