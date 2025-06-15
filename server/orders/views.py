import stripe
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from core.settings import SITE_URL, STRIPE_SECRET_KEY, EMAIL_HOST_USER

def send_order_confirmation_email(user, order):
    message = f"""
    Hi {user.first_name or user.username},

    Thank you for your order #{order.id}!

    Order Details:
    - Total Amount: ${order.total_amount}
    - Status: Paid
    - Placed On: {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}

    We’ll notify you when it ships.

    Regards,
    Your E-commerce Store
    """
    send_mail(
        subject='🧾 Order Confirmation - Order #' + str(order.id),
        message=message,
        from_email= EMAIL_HOST_USER,
        recipient_list=['kautilya101001@gmail.com'],
        fail_silently=False,
    )

stripe.api_key = STRIPE_SECRET_KEY

@api_view(['POST'])
def initiate_payment(request):
    try:
        order_id = request.data.get('order_id')
        order = Order.objects.get(id=order_id, user=request.user)

        if order.status != 'pending':
            return Response({"error": "Payment already processed or cancelled."}, status=400)

        intent = stripe.PaymentIntent.create(
            amount=int(order.total_amount * 100),
            currency='usd',
            metadata={'order_id': order.id, 'user_id': request.user.id},
        )

        return Response({"clientSecret": intent.client_secret})
    except Order.DoesNotExist:
        return Response({"error": "Order not found."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_payment_intent(request):
    try:
        payment_intent_id = request.data.get('payment_intent_id')
        stripe.PaymentIntent.cancel(payment_intent_id)
        return Response({"message": "Payment cancelled."})
    except Exception as e:
        return Response({"error": str(e)}, status=500)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save(user=request.user)
        print(SITE_URL, STRIPE_SECRET_KEY)

        # Create Stripe Checkout Session instead of PaymentIntent
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'unit_amount': int(order.total_amount * 100),
                        'product_data': {
                            'name': f"Order #{order.id}",
                        },
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f"{SITE_URL}/orders/{order.id}?success=true",
                cancel_url=f"{SITE_URL}/orders/{order.id}?success=false",
                metadata={
                    'order_id': order.id,
                    'user_id': request.user.id,
                },
            )
            print(checkout_session.url)
            payment_url = checkout_session.url
        except Exception as e:
            return Response({"error": f"Stripe error: {str(e)}"}, status=500)

        # Send confirmation email
        if(payment_url):
            send_order_confirmation_email(request.user, order)

        headers = self.get_success_headers(serializer.data)
        return Response({
            "order": serializer.data,
            "payment_url": payment_url
        }, status=201, headers=headers)


# # ✅ Stripe Webhook Handler (to be added in views.py)
# from django.views.decorators.csrf import csrf_exempt
# from django.http import HttpResponse

# @csrf_exempt
# def stripe_webhook_view(request):
#     payload = request.body
#     sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
#     event = None

#     try:
#         event = stripe.Webhook.construct_event(
#             payload, sig_header, settings.STRIPE_SECRET_WEBHOOK
#         )
#     except (ValueError, stripe.error.SignatureVerificationError):
#         return HttpResponse(status=400)

#     if event['type'] == 'checkout.session.completed':
#         session = event['data']['object']
#         order_id = session['metadata']['order_id']
#         from .models import Order
#         order = Order.objects.get(id=order_id)
#         order.status = 'paid'
#         order.save()

#     return HttpResponse(status=200)
