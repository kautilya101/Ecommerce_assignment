from django.urls import path
from .views import ProductDetailAPIView, ProductListAPIView, ProductCreateAPIView

urlpatterns = [
  path('products/', ProductListAPIView.as_view(), name='product-list'),
  path('products/<int:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),
  path('products/create/', ProductCreateAPIView.as_view(), name='product-create'),
]