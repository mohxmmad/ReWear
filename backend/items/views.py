from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Q
from .models import Item
from .serializers import ItemSerializer

@method_decorator(csrf_exempt, name='dispatch')
class ItemListCreateView(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Item.objects.filter(approved=True, status='available')
        # Filters
        category = self.request.query_params.get('category')
        size = self.request.query_params.get('size')
        condition = self.request.query_params.get('condition')
        search = self.request.query_params.get('search')
        if category and category != 'all':
            qs = qs.filter(category__iexact=category)
        if size and size != 'all':
            qs = qs.filter(size__iexact=size)
        if condition and condition != 'all':
            qs = qs.filter(condition__iexact=condition)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search) | Q(tags__icontains=search))
        return qs.order_by('-created_at')

    def perform_create(self, serializer):
        # New items go to pending review (human verification)
        item = serializer.save(uploader=self.request.user, approved=False, status='pending')
        return item

@method_decorator(csrf_exempt, name='dispatch')
class ItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        # Only uploader or admin can update; reset approval if edited
        item = self.get_object()
        if item.uploader != self.request.user and not self.request.user.is_staff:
            return
        serializer.save(approved=False, status='pending')

@method_decorator(csrf_exempt, name='dispatch')
class MyItemsView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(uploader=self.request.user).order_by('-created_at')

@method_decorator(csrf_exempt, name='dispatch')
class PendingItemsView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Item.objects.filter(approved=False, status='pending').order_by('-created_at')

@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def approve_item(request, pk):
    try:
        item = Item.objects.get(pk=pk)
    except Item.DoesNotExist:
        return Response({"detail": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
    item.approved = True
    item.status = 'available'
    item.rejection_reason = ''
    item.save()
    # Reward points to uploader for listing (human verified)
    try:
        profile = item.uploader.profile
        profile.points += item.point_value // 2  # reward half points for listing
        profile.save()
    except Exception:
        pass
    return Response(ItemSerializer(item).data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def reject_item(request, pk):
    try:
        item = Item.objects.get(pk=pk)
    except Item.DoesNotExist:
        return Response({"detail": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
    reason = request.data.get('reason', 'Not meeting quality standards')
    item.approved = False
    item.status = 'rejected'
    item.rejection_reason = reason
    item.save()
    return Response(ItemSerializer(item).data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_items(request):
    items = Item.objects.filter(approved=True, status='available').order_by('-created_at')[:4]
    return Response(ItemSerializer(items, many=True).data)
