from django.urls import path
from .views import SwapRequestCreateView, SwapRequestListView, update_swap_status

urlpatterns = [
    path('request/', SwapRequestCreateView.as_view(), name='swap-request'),
    path('', SwapRequestListView.as_view(), name='swap-list'),
    path('<int:pk>/status/', update_swap_status, name='swap-status'),
]
