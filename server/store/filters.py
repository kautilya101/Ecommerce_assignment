from .models import Product
import django_filters


class ProductFilter(django_filters.FilterSet):
  price_max = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
  price_min = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
  search = django_filters.CharFilter(field_name='category_name', lookup_expr="icontains")

  class Meta:
    model = Product
    fields = ['search', 'price_min', 'price_max']