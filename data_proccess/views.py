from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Lifafa, ScrapbookPage  
s
# Your existing views
def enjoy(request):
    return render(request, 'customization/for-you.html')

def celeb(request):
    return render(request, 'customization/only-for-you.html')

# Updated Logic to Save Data to the Database
def save_data(request):
    if request.method == 'POST':
        # 1. Fetch text data from the frontend
        receiver = request.POST.get('receiver_name', '')
        message = request.POST.get('message', '')
        sender = request.POST.get('sender_name', '')

        # 2. Create and save a new Lifafa entry in the database
        new_lifafa = Lifafa.objects.create(
            receiver_name=receiver,
            sender_name=sender,
            message=message
        )
        
        # 3. Loop through the 8 blocks and save ScrapbookPages
        for i in range(1, 9):
            image_file = request.FILES.get(f'image_{i}') 
            quote_text = request.POST.get(f'quote_{i}', '')
            
            # If the user uploaded an image OR wrote a quote for this block, save it
            if image_file or quote_text:
                ScrapbookPage.objects.create(
                    lifafa=new_lifafa,
                    page_number=i,
                    image=image_file,
                    quote_text=quote_text
                )

        # 4. Generate the actual sharable link using the Database ID
        actual_uuid = str(new_lifafa.id)
        generated_link = f"http://127.0.0.1:8000/shared-lifafa/{actual_uuid}/"

        # 5. Return success response to frontend
        return JsonResponse({
            'success': True, 
            'message': 'Database successfully updated!',
            'link': generated_link
        })

    return JsonResponse({'success': False, 'error': 'Invalid request method.'})

def view_lifafa(request, pk):
    # 1. Fetch the main Envelope (Lifafa) using the unique ID from the URL
    # If the ID doesn't exist in the database, it automatically shows a 404 Error page
    lifafa = get_object_or_404(Lifafa, id=pk)
    
    # 2. Fetch all the uploaded pages/photos linked to this specific Lifafa
    pages = lifafa.pages.all()
    
    # 3. Create a dictionary to easily map page numbers (1 to 8) to their data
    # This ensures your fixed CSS layout doesn't break
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
    # (You can use your existing template, or create a duplicate named 'receiver_view.html')
    return render(request, 'customization/only-for-you.html', context)