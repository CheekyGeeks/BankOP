from django.urls import path
from .views import authenticate_face

urlpatterns = [
    path('verify/', authenticate_face),
]
