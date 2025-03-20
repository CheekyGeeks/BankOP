from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    api_root,
    UserRegistrationView,
    GenerateTokenView,
    LoginView,
    FaceVerificationView,
    CompleteRegistrationWithFaceView,
    UserProfileView,
    verify_email,
    download_required_software
)

urlpatterns = [
    path('api/', api_root, name='api-root'),  
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('generate-token/', GenerateTokenView.as_view(), name='generate-token'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('face-verification/', FaceVerificationView.as_view(), name='face-verification'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('verify-email/<str:token>/', verify_email, name='verify-email'),
    path('download-software/', download_required_software, name='download-software'),
    path('complete-registration/', CompleteRegistrationWithFaceView.as_view(), name='complete_registration'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
