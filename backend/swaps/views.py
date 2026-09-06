from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import SwapRequest
from .serializers import SwapRequestSerializer

@method_decorator(csrf_exempt, name='dispatch')
class SwapRequestCreateView(generics.CreateAPIView):
    queryset = SwapRequest.objects.all()
    serializer_class = SwapRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        item_requested = serializer.validated_data.get('item_requested')
        item_offered = serializer.validated_data.get('item_offered')
        if item_requested.uploader == self.request.user:
            raise serializers.ValidationError("Cannot request your own item")
        if item_offered and item_offered.uploader != self.request.user:
            raise serializers.ValidationError("You can only offer your own items")
        serializer.save(from_user=self.request.user, to_user=item_requested.uploader)

@method_decorator(csrf_exempt, name='dispatch')
class SwapRequestListView(generics.ListAPIView):
    serializer_class = SwapRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SwapRequest.objects.filter(from_user=user) | SwapRequest.objects.filter(to_user=user)

@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_swap_status(request, pk):
    try:
        swap = SwapRequest.objects.get(pk=pk)
    except SwapRequest.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
    if swap.to_user != request.user and swap.from_user != request.user:
        return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    new_status = request.data.get('status')
    if new_status not in ['accepted', 'declined']:
        return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
    # Only receiver can accept/decline
    if swap.to_user != request.user:
        return Response({"detail": "Only recipient can update"}, status=status.HTTP_403_FORBIDDEN)
    swap.status = new_status
    swap.save()
    if new_status == 'accepted':
        # Mark items as swapped
        swap.item_offered.status = 'swapped'
        swap.item_offered.save()
        swap.item_requested.status = 'swapped'
        swap.item_requested.save()
    return Response(SwapRequestSerializer(swap).data)
