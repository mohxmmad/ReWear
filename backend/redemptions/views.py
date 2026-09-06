from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Redemption
from .serializers import RedemptionSerializer
from items.models import Item
from accounts.models import UserProfile

@method_decorator(csrf_exempt, name='dispatch')
class RedeemItemView(generics.CreateAPIView):
    serializer_class = RedemptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        item_id = request.data.get("item_id") or request.data.get("item")
        if not item_id:
            return Response({"detail": "item_id required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

        if not item.approved or item.status != "available":
            return Response({"detail": "Item is not available."}, status=status.HTTP_400_BAD_REQUEST)

        if item.uploader == request.user:
            return Response({"detail": "Cannot redeem your own item."}, status=status.HTTP_400_BAD_REQUEST)

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.points < item.point_value:
            return Response({"detail": f"Insufficient points. Need {item.point_value}, have {profile.points}."}, status=status.HTTP_400_BAD_REQUEST)

        profile.points -= item.point_value
        profile.save()

        # Credit uploader
        try:
            uploader_profile, _ = UserProfile.objects.get_or_create(user=item.uploader)
            uploader_profile.points += item.point_value
            uploader_profile.save()
        except Exception:
            pass

        item.status = "redeemed"
        item.save()

        redemption = Redemption.objects.create(user=request.user, item=item, points_spent=item.point_value)
        return Response({"message": "Item redeemed successfully.", "redemption": RedemptionSerializer(redemption).data}, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name='dispatch')
class RedemptionListView(generics.ListAPIView):
    serializer_class = RedemptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Redemption.objects.filter(user=self.request.user).order_by('-created_at')
