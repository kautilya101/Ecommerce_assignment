# E-commerce Platform

A full-stack e-commerce platform built with Django REST Framework and React.

## Project Structure

```
.
├── client/          # React frontend
├── server/          # Django backend
│   ├── core/       # Django project core
│   ├── store/      # Store app
│   ├── orders/     # Orders app
│   └── manage.py   # Django management script
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL
- Stripe account
- SMTP server for email functionality

## Backend Setup

1. Create and activate a virtual environment:
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the server directory with the following variables:
```env
# Django
DJANGO_SECRET_KEY=your_secret_key_here
DEBUG=True

# Database
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5433

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_specific_password
DEFAULT_FROM_EMAIL=your_email@gmail.com
SITE_URL=http://localhost:3000

```

4. Run database migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

## Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Start the development server:
```bash
npm start
```

## API Documentation

### Authentication Endpoints

- `POST /api/token/` - Get JWT access token
- `POST /api/token/refresh/` - Refresh JWT token
- `POST /api/token/verify/` - Verify JWT token

### Store Endpoints

- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/` - Create new product (admin only)
- `PUT /api/products/{id}/` - Update product (admin only)
- `DELETE /api/products/{id}/` - Delete product (admin only)

### Order Endpoints

- `GET /api/orders/` - List user's orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `PUT /api/orders/{id}/` - Update order status (admin only)

## Email Configuration

The application uses SMTP for sending emails. Configure your email settings in the `.env` file:

- For Gmail:
  1. Enable 2-factor authentication
  2. Generate an App Password
  3. Use the App Password in EMAIL_HOST_PASSWORD

- For other providers:
  - Update EMAIL_HOST, EMAIL_PORT, and other settings accordingly

## Stripe Integration

1. Sign up for a Stripe account
2. Get your API keys from the Stripe Dashboard
3. Add the keys to your environment variables:
   - Backend: STRIPE_SECRET_KEY
   - Frontend: REACT_APP_STRIPE_PUBLIC_KEY

## Development

- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:3000
- API documentation available at http://localhost:8000/api/docs/

## Production Deployment

Before deploying to production:

1. Set DEBUG=False in .env
2. Update ALLOWED_HOSTS in settings.py
3. Configure proper database credentials
4. Set up proper email configuration
5. Configure CORS settings
6. Set up proper static file serving
7. Use HTTPS in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
