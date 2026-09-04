from rest_framework import serializers
from .models import SwapRequest

class SwapRequestSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source='from_user.username', read_only=True)
    to_username = serializers.CharField(source='to_user.username', read_only=True)
    item_offered_title = serializers.CharField(source='item_offered.title', read_only=True)
    item_requested_title = serializers.CharField(source='item_requested.title', read_only=True)

    class Meta:
        model = SwapRequest
        fields = ['id', 'from_user', 'from_username', 'to_user', 'to_username', 'item_offered', 'item_offered_title', 'item_requested', 'item_requested_title', 'status', 'created_at']
        read_only_fields = ['from_user', 'to_user', 'status', 'created_at']
