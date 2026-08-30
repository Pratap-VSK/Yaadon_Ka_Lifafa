from django.db import models
import uuid

# 1. Main Model for the Envelope (Lifafa)
class Lifafa(models.Model):
    # Generates a unique 8-character ID for the sharing link automatically
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    receiver_name = models.CharField(max_length=200, blank=True, null=True)
    sender_name = models.CharField(max_length=200, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lifafa for {self.receiver_name} (by {self.sender_name})"

# 2. Model for the 8 Scrapbook Pages (Photos and Quotes)
class ScrapbookPage(models.Model):
    # Links this page to a specific Lifafa
    lifafa = models.ForeignKey(Lifafa, on_delete=models.CASCADE, related_name='pages')
    page_number = models.IntegerField()
    
    # Stores the uploaded image in the 'media/scrapbook_images/' folder
    image = models.ImageField(upload_to='scrapbook_images/', blank=True, null=True)
    quote_text = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Page {self.page_number} for {self.lifafa.id}"