from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import UserProfile, PaymentDetail
from .serializers import UserRegistrationSerializer, BiometricDataSerializer
from biometric_auth.models import BiometricData, BiometricVerification
from biometric_auth.utils import BiometricProcessor
from rest_framework_simplejwt.tokens import RefreshToken

class SignUpView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # Prepare data for serializer in the expected format
        data = {
            'username': request.data.get('userName', ''),
            'email': request.data.get('email', ''),
            'profile': {
                'phone_number': request.data.get('phoneNumber', ''),
                'aadhar_number': request.data.get('aadharNumber', ''),
                'consumer_id': request.data.get('consumerId', ''),
                'software_downloaded': request.data.get('softwareDownloaded', False),
            },
            'payment_details': {
                'bank_name': request.data.get('bankName', ''),
                'card_number': request.data.get('cardNumber', ''),
                'expiry_date': request.data.get('expiryDate', ''),
                'cvv': request.data.get('cvv', ''),
            }
        }
        
        serializer = UserRegistrationSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'status': 'success',
                'message': 'User registered successfully. Biometric verification is required.',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BiometricVerificationView(APIView):
    permission_classes = [permissions.AllowAny]  # In production, add proper authentication
    
    def post(self, request):
        user_id = request.data.get('user_id')
        face_image = request.data.get('face_image')
        fingerprint_data = request.data.get('fingerprint_data')
        
        try:
            user = User.objects.get(id=user_id)
            biometric_data = BiometricData.objects.get(user=user)
            
            # Process and store biometric data
            if face_image:
                face_template = BiometricProcessor.process_face_image(face_image)
                if face_template:
                    biometric_data.face_template = face_template
            
            if fingerprint_data:
                fingerprint_template = BiometricProcessor.process_fingerprint(fingerprint_data)
                if fingerprint_template:
                    biometric_data.fingerprint_template = fingerprint_template
            
            # Mark as verified
            biometric_data.is_verified = True
            biometric_data.save()
            
            # Update user profile
            user_profile = UserProfile.objects.get(user=user)
            user_profile.biometric_verified = True
            user_profile.save()
            
            # Record verification
            BiometricVerification.objects.create(
                user=user,
                verification_type='face' if face_image else 'fingerprint',
                is_successful=True,
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            # Generate tokens for authentication
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'status': 'success',
                'message': 'Biometric verification successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)