from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as django_login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache


@never_cache
def login(request):
    """
    Handles both rendering the authentication page and processing Login/Signup POST requests.
    """
    if request.method == 'POST':
        # Check if the user is trying to login or register based on a hidden input or button name
        action = request.POST.get('action') 
        
        username = request.POST.get('username')
        password = request.POST.get('password')

        if action == 'register':
            # Handle User Registration
            email = request.POST.get('email', '')
            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already exists. Please choose another.")
            else:
                # Create the new user securely
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                messages.success(request, "Account created successfully! You can now log in.")
                return redirect('login')

        elif action == 'login':
            # Handle User Login
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # Log the user in and redirect to the loading screen
                django_login(request, user)
                return redirect('loading')
            else:
                messages.error(request, "Invalid username or password.")

    # If GET request, just render the authentication page
    return render(request, 'accounts/authentication.html')

@login_required
@never_cache
def loading(request):
    """
    Renders the loading animation page.
    Usually, this page redirects the user to the main app (e.g., 'for-you' page) after a few seconds using JavaScript.
    """
    # Optional: Prevent unauthenticated users from seeing the loading/main pages
    if not request.user.is_authenticated:
        return redirect('login')
        
    return render(request, 'accounts/loading.html')


@login_required
@never_cache
def logout_user(request):
    """
    Logs the user out and sends them back to the login page.
    """
    logout(request)
    return redirect('login')