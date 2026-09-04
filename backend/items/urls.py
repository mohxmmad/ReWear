from django.urls import path
from .views import ItemListCreateView, ItemDetailView, MyItemsView, PendingItemsView, approve_item, reject_item, featured_items

urlpatterns = [
    path('', ItemListCreateView.as_view(), name='item-list-create'),
    path('featured/', featured_items, name='featured'),
    path('my/', MyItemsView.as_view(), name='my-items'),
    path('pending/', PendingItemsView.as_view(), name='pending-items'),
    path('<int:pk>/', ItemDetailView.as_view(), name='item-detail'),
    path('<int:pk>/approve/', approve_item, name='item-approve'),
    path('<int:pk>/reject/', reject_item, name='item-reject'),
]
