from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Lifafa, ScrapbookPage

def enjoy(request):
    return render(request, 'customization/for-you.html')

def celeb(request):
    return render(request, 'customization/only-for-you.html')

# Updated Logic to Save Data to the Database
def save_data(request):
    if request.method == 'POST':
        # 1. Fetch text data matching the JavaScript FormData keys exactly
        heading = request.POST.get('main_heading', '')
        receiver = request.POST.get('letter_to', '')
        message = request.POST.get('letter_body', '')
        sender = request.POST.get('letter_from', '')

        new_lifafa = Lifafa.objects.create(
            main_heading=heading,
            receiver_name=receiver,
            sender_name=sender,
            message=message
        )
        
        for i in range(1, 9):
            # Fetch image using 'photo_{i}' instead of 'image_{i}' to match JS
            image_file = request.FILES.get(f'photo_{i}') 
            quote_text = request.POST.get(f'quote_{i}', '')
            
            if image_file or quote_text.strip():
                ScrapbookPage.objects.create(
                    lifafa=new_lifafa,
                    page_number=i,
                    image=image_file,
                    quote_text=quote_text
                )

        actual_uuid = str(new_lifafa.id)
        generated_link = f"http://127.0.0.1:8000/shared-lifafa/{actual_uuid}/"

        # 5. Return success response to frontend
        return JsonResponse({
            'success': True, 
            'message': 'Database successfully updated!',
            'link': generated_link
        })

    return JsonResponse({'success': False, 'error': 'Invalid request method.'}, status=400)

def view_lifafa(request, pk):
    # 1. Fetch the main Envelope (Lifafa) using the unique ID from the URL
    lifafa = get_object_or_404(Lifafa, id=pk)
    
    pages = lifafa.pages.all()
    
    page_data = {}
    for page in pages:
        page_data[page.page_number] = page

    # 4. Pack the data into a 'context' dictionary to send to the HTML
    context = {
        'lifafa': lifafa,
        'page_data': page_data,
        'is_receiver_mode': True # A flag to tell HTML to hide the "Save" button
    }
    
    # 5. Render the page with the fetched data
    return render(request, 'customization/only-for-you.html', context)