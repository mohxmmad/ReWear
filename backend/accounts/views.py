from django.contrib.auth import get_user_model, authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator
import os
from dotenv import load_dotenv

from .serializers import RegisterSerializer, CompleteProfileSerializer, UserProfileSerializer
from .models import UserProfile

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Auto login after register
            login(request, user)
            profile, _ = UserProfile.objects.get_or_create(user=user)
            return Response({
                "message": "User registered successfully",
                "username": user.username,
                "points": profile.points
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_superuser(request):
    secret_key = request.data.get("secret_key")
    expected_key = os.getenv("SUPERUSER_SECRET_KEY")

    if secret_key != expected_key:
        return Response({"detail": "Invalid secret key."}, status=status.HTTP_400_BAD_REQUEST)

    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not (username and email and password):
        return Response({"detail": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"detail": "User already exists."}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_superuser(username=username, email=email, password=password)
    return Response({"detail": "Superuser created successfully."}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        profile, _ = UserProfile.objects.get_or_create(user=user)
        return Response({
            "detail": "Login successful.",
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "points": profile.points
        }, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf(request):
    return Response({"detail": "CSRF cookie set"})

@api_view(['GET'])
@permission_classes([AllowAny])
def login_check(request):
    if request.user.is_authenticated:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response({
            "is_authenticated": True,
            "is_logged_in": True,
            "username": request.user.username,
            "email": request.user.email,
            "is_staff": request.user.is_staff,
            "points": profile.points
        }, status=status.HTTP_200_OK)
    else:
        return Response({"is_authenticated": False, "is_logged_in": False}, status=status.HTTP_200_OK)

@api_view(['GET'])
def me_view(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
def complete_profile(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    serializer = CompleteProfileSerializer(instance=request.user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response({"message": "Profile completed", "points": profile.points, "profile": UserProfileSerializer(profile).data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
