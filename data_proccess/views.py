from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Lifafa, ScrapbookPage

def sender_page(request):
    return render(request, 'customization/sender.html')

def save_data(request):
    if request.method == 'POST':
        try:
            lifafa = Lifafa.objects.create(
                main_heading=request.POST.get('main_heading', ''),
                receiver_name=request.POST.get('letter_to', ''),
                message=request.POST.get('letter_body', ''),
                sender_name=request.POST.get('letter_from', '')
            )
            
            for i in range(1, 9):
                photo = request.FILES.get(f'photo_{i}')
                quote = request.POST.get(f'quote_{i}')
                
                if photo or quote:
                    ScrapbookPage.objects.create(
                        lifafa=lifafa,
                        page_number=i,
                        image=photo,
                        quote_text=quote
                    )
            
            return JsonResponse({
                'success': True, 
                'secret_key': lifafa.secret_key
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
            
    return JsonResponse({'success': False, 'error': 'Invalid Request'})

def user_page(request, secret_key):
    lifafa = get_object_or_404(Lifafa, secret_key=secret_key)
    
    pages = {page.page_number: page for page in lifafa.pages.all()}
    
    context = {
        'lifafa': lifafa,
        'pages': pages,
    }
    return render(request, 'customization/user.html', context)

def loading_page(request, secret_key):
    lifafa = get_object_or_404(Lifafa, secret_key=secret_key)
    return render(request, 'customization/load.html', {'secret_key': secret_key})