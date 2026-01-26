from django.shortcuts import render
from dotenv import load_dotenv
from django.contrib.auth import get_user_model, authenticate, login
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import os

from .serializers import RegisterSerializer, CompleteProfileSerializer

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Get the custom user model
User = get_user_model()

# ✅ Register View (CSRF exempt)
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Create Superuser (CSRF exempt)
@csrf_exempt
@api_view(['POST'])
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

# ✅ Login View (CSRF exempt)
@api_view(['POST'])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({"detail": "Login successful."}, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def login_check(request):
    if request.user.is_authenticated:
        return Response({"is_authenticated": True, "username": request.user.username}, status=status.HTTP_200_OK)
    else:
        return Response({"is_authenticated": False}, status=status.HTTP_401_UNAUTHORIZED)
    
# ✅ Complete Profile View (CSRF exempt)
@csrf_exempt
@api_view(['POST'])
def complete_profile(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = CompleteProfileSerializer(instance=request.user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile completed", "points": request.user.points})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
