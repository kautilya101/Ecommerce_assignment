from django.urls import path
from .views import CartItemListCreateAPIView, CartItemUpdateDeleteAPIView, CreateOrderAPIView, initiate_payment, cancel_payment_intent

urlpatterns = [
    path('cart/', CartItemListCreateAPIView.as_view(), name='cart-list-create'),
    path('cart/<int:pk>/', CartItemUpdateDeleteAPIView.as_view(), name='cart-update-delete'),
    path('orders/', CreateOrderAPIView.as_view(), name='create-order'),
    path('orders/<int:pk>/payment/initiate/', initiate_payment, name='initiate-payment'),
    path('orders/<int:pk>/payment/cancel/', cancel_payment_intent, name='cancel-payment'),
]
