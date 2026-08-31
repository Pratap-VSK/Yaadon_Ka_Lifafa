from django.db import models
import random
import string

def generate_secret_key():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

class Lifafa(models.Model):
    secret_key = models.CharField(max_length=8, primary_key=True, default=generate_secret_key, editable=False)
    main_heading = models.CharField(max_length=200, blank=True, null=True)
    receiver_name = models.CharField(max_length=100, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    sender_name = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lifafa for {self.receiver_name} ({self.secret_key})"

class ScrapbookPage(models.Model):
    lifafa = models.ForeignKey(Lifafa, related_name='pages', on_delete=models.CASCADE)
    page_number = models.IntegerField()
    image = models.ImageField(upload_to='scrapbook_images/', blank=True, null=True)
    quote_text = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Page {self.page_number} - {self.lifafa.secret_key}"