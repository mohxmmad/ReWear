from django.db import models
from django.conf import settings
import os

# Use CloudinaryField if cloudinary is configured, otherwise fallback to ImageField
try:
    from cloudinary.models import CloudinaryField
    _use_cloudinary = bool(os.getenv('CLOUDINARY_CLOUD_NAME'))
    if _use_cloudinary:
        ImageField = CloudinaryField
    else:
        ImageField = lambda *a, **kw: models.ImageField(upload_to='items/', *a, **kw)
except Exception:
    ImageField = lambda *a, **kw: models.ImageField(upload_to='items/', *a, **kw)

class Item(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('pending', 'Pending'),
        ('swapped', 'Swapped'),
        ('redeemed', 'Redeemed'),
        ('rejected', 'Rejected'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, default='Other')
    type = models.CharField(max_length=50, default='Other', blank=True)
    size = models.CharField(max_length=20, default='M')
    condition = models.CharField(max_length=20, default='Good')
    tags = models.TextField(blank=True)
    
    point_value = models.PositiveIntegerField(default=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    image = ImageField('image', blank=True, null=True)
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    approved = models.BooleanField(default=False)
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
