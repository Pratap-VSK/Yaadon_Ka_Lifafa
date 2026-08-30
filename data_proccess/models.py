from django.db import models
import uuid

class Lifafa(models.Model):
    # Auto-generates unique ID for the link
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Outer text (Poem / Heading)
    main_heading = models.TextField(blank=True, null=True)
    
    # Inner Letter details
    receiver_name = models.CharField(max_length=200, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    sender_name = models.CharField(max_length=200, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lifafa for {self.receiver_name} (by {self.sender_name})"


# 2. Model for Scrapbook Pages (Handles infinite Photos and Quotes)
class ScrapbookPage(models.Model):
    # Links this page to a specific Lifafa
    lifafa = models.ForeignKey(Lifafa, on_delete=models.CASCADE, related_name='pages')
    page_number = models.IntegerField()
    
    # Stores the uploaded image
    image = models.ImageField(upload_to='scrapbook_images/', blank=True, null=True)
    quote_text = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Page {self.page_number} for {self.lifafa.id}"