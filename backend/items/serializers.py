from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    uploader_username = serializers.CharField(source='uploader.username', read_only=True)
    uploader_email = serializers.CharField(source='uploader.email', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ['id', 'title', 'description', 'category', 'type', 'size', 'condition', 'tags',
                  'point_value', 'status', 'approved', 'rejection_reason',
                  'image', 'image_url', 'uploader', 'uploader_username', 'uploader_email',
                  'created_at', 'updated_at']
        read_only_fields = ['uploader', 'approved', 'status', 'rejection_reason', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        if obj.image:
            try:
                return obj.image.url
            except Exception:
                return str(obj.image)
        return None

    def create(self, validated_data):
        # Handle point_value alias
        if 'point_value' not in validated_data and 'points' in self.initial_data:
            try:
                validated_data['point_value'] = int(self.initial_data.get('points') or self.initial_data.get('point_value', 50))
            except:
                validated_data['point_value'] = 50
        return super().create(validated_data)
