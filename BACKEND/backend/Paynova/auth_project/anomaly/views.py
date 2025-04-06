from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def check_anomalies(request):
    status = request.data  # system/network info from EXE
    result = run_anomaly_detection(status)
    return Response({'anomaly': result})
