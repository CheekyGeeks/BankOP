from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView,
    GenerateTokenView,
    LoginView,
    FaceVerificationView,
    UserProfileView
)
from django.urls import path
from .views import api_root  # Import your view

urlpatterns = [
    path('api/', api_root, name='api-root'),  # Add this line
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('generate-token/', GenerateTokenView.as_view(), name='generate-token'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('face-verification/', FaceVerificationView.as_view(), name='face-verification'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]





