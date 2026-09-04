from rest_framework import serializers
from .models import User, UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # Accept both conventions
    firstName = serializers.CharField(required=False, allow_blank=True, write_only=True)
    lastName = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'firstName', 'lastName')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate(self, attrs):
        # Map camelCase to snake_case if provided
        if 'firstName' in attrs and not attrs.get('first_name'):
            attrs['first_name'] = attrs.pop('firstName')
        else:
            attrs.pop('firstName', None)
        if 'lastName' in attrs and not attrs.get('last_name'):
            attrs['last_name'] = attrs.pop('lastName')
        else:
            attrs.pop('lastName', None)
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Ensure profile gets 100 points
        try:
            profile = user.profile
            if profile.points == 0:
                profile.points = 100
                profile.save()
        except Exception:
            pass
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)

    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'phone', 'address', 'points')


class CompleteProfileSerializer(serializers.Serializer):
    phone = serializers.CharField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    def update(self, instance, validated_data):
        # instance is User
        phone = validated_data.get('phone') or validated_data.get('phone_number', '')
        address = validated_data.get('address', '')
        profile, _ = UserProfile.objects.get_or_create(user=instance)
        if phone:
            profile.phone = phone
        if address:
            profile.address = address
        if profile.points == 0:
            profile.points = 100
        profile.save()
        return instance

    def to_representation(self, instance):
        profile, _ = UserProfile.objects.get_or_create(user=instance)
        return {
            'username': instance.username,
            'email': instance.email,
            'phone': profile.phone,
            'address': profile.address,
            'points': profile.points,
        }