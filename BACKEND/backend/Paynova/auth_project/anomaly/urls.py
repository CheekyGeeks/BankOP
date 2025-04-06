from django.urls import path
from .views import check_anomalies

urlpatterns = [
    path('verify/', check_anomalies),
]
