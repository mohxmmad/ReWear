from rest_framework import serializers
from .models import Redemption

class RedemptionSerializer(serializers.ModelSerializer):
    item_title = serializers.CharField(source='item.title', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Redemption
        fields = ['id', 'user', 'username', 'item', 'item_title', 'points_spent', 'created_at']
        read_only_fields = ['user', 'points_spent', 'created_at']
