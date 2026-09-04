from django.urls import path
from .views import create_superuser, RegisterView, login_view, logout_view, complete_profile, login_check, me_view, get_csrf

urlpatterns = [
    path('create-superuser/', create_superuser),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('islogin/', login_check, name='login-check'),
    path('csrf/', get_csrf, name='csrf'),
    path('me/', me_view, name='me'),
    path('complete-profile/', complete_profile, name='complete-profile'),
]
