from django.urls import path
from .views import RedeemItemView, RedemptionListView

urlpatterns = [
    path('redeem/', RedeemItemView.as_view(), name='redeem-item'),
    path('', RedemptionListView.as_view(), name='redemption-list'),
]
