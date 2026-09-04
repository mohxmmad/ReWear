from django.contrib import admin
from .models import Redemption

@admin.register(Redemption)
class RedemptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'points_spent', 'created_at')
    list_filter = ('created_at',)
