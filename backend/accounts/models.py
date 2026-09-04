from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    # username, email, password already exist
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

    @property
    def points(self):
        try:
            return self.profile.points
        except Exception:
            return 0

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance, defaults={'points': 100})

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except UserProfile.DoesNotExist:
        UserProfile.objects.create(user=instance, points=100)
