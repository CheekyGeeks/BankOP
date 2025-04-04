import datetime
import logging
import random
import string
import os
from django.http import HttpResponse, FileResponse
from django.conf import settings
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, FaceVerification, OneTimePassword
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    TokenRequestSerializer,
    LoginSerializer,
    FaceImageSerializer,
    FaceVerificationSerializer
)
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([AllowAny])
def download_required_software(request):
    """
    Endpoint to download the required software package
    """
    try:
        # Path to your software file in your project
        # You should store this file in a secure location, like MEDIA_ROOT
        file_path = os.path.join(settings.MEDIA_ROOT, 'software', 'required_software.zip')
        
        if os.path.exists(file_path):
            response = FileResponse(
                open(file_path, 'rb'),
                content_type='application/zip'
            )
            response['Content-Disposition'] = 'attachment; filename="payflow_required_software.zip"'
            return response
        else:
            logger.error("Software file not found at path: %s", file_path)
            return Response({
                "success": False,
                "message": "Software file not found"
            }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Failed to serve software download: {str(e)}")
        return Response({
            "success": False,
            "message": "Failed to process download request"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
def api_root(request):
    return Response({
        "message": "API is running",
        "status": "OK",
        "endpoints": {
            "register": "/api/register/",
            "login": "/api/login/",
            "token/refresh": "/api/token/refresh/",
            "face-verification": "/api/face-verification/",
            "profile": "/api/profile/",
        }
    })

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Add logging for debugging
        logger.info(f"Registration request data: {request.data}")
        
        # Check if software is installed
        software_installed = request.data.get('software_installed', False)
        if not software_installed:
            return Response({
                "success": False,
                "message": "You must download and install the required software to proceed",
                "errors": {"software_installed": ["Required software must be installed"]}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate temp password if not exists
            if not user.temp_password:
                temp_password = User.objects.generate_password()
                user.set_password(temp_password)
                user.temp_password = temp_password
                user.save()
            
            # Send verification email with password
            self.send_verification_email(user)
            
            # Generate a temporary token for face verification step
            token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
            user.face_verification_token = token
            user.face_verification_expires = timezone.now() + datetime.timedelta(hours=1)
            user.save()
            
            return Response({
                "success": True,
                "message": "User registered successfully. Proceed to face verification.",
                "face_verification_token": token,
                "consumer_id": user.consumer_id
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
     
    def send_verification_email(self, user):
        try:
            # Create verification token
            token = ''.join(random.choices(string.ascii_letters + string.digits, k=64))
            
            # Store token in user model or separate verification table
            # Create expiry time for token
            verification_expires = timezone.now() + datetime.timedelta(hours=24)
            
            # In a real implementation, save this token to a verification model
            # For now, just store it temporarily on the user (create a field for this)
            user.verification_token = token
            user.verification_expires = verification_expires
            # Don't set email as verified until they click the link
            user.is_email_verified = False
            user.save()
            
            # Create email content
            subject = "Complete Your Registration - Email Verification"
            verification_url = f"{settings.FRONTEND_URL}/verify-email/{token}/"
            message = f"""
            Hello {user.full_name},
            
            Thank you for registering with Pay Flow. Please use the following credentials to log in:
            
            Customer ID: {user.consumer_id}
            Temporary Password: {user.temp_password}
            
            Please click on the link below to verify your email address:
            {verification_url}
            
            This link will expire in 24 hours.
            
            If you did not create an account, please ignore this email.
            
            Best Regards,
            The Pay Flow Team
            """
            
            # Send email
            result = send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            logger.info(f"Verification email sent to {user.email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send verification email: {str(e)}")
            return False

class GenerateTokenView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = TokenRequestSerializer(data=request.data)
        if serializer.is_valid():
            consumer_id = serializer.validated_data['consumer_id']
            
            try:
                user = User.objects.get(consumer_id=consumer_id)
                
                # Generate new password
                temp_password = User.objects.generate_password()
                user.set_password(temp_password)
                user.save()
                
                # Save password in OneTimePassword model
                otp = OneTimePassword.objects.create(
                    user=user,
                    password=temp_password,
                    expires_at=timezone.now() + datetime.timedelta(minutes=15)
                )
                
                # Send email with new password
                self.send_password_email(user, temp_password)
                
                return Response({
                    "success": True,
                    "message": "A new password has been sent to your email"
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({
                    "success": False,
                    "message": "User with this Consumer ID not found"
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def send_password_email(self, user, password):
        try:
            subject = "Your New Login Token"
            message = f"""
            Hello {user.full_name},
            
            Here is your new login token for Pay Flow:
            
            Temporary Password: {password}
            
            This password will be valid for 15 minutes.
            
            Best Regards,
            The Pay Flow Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            logger.info(f"New password email sent to {user.email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send password email: {str(e)}")
            return False

class LoginView(APIView):
    permission_classes = [AllowAny]
    # Track failed login attempts
    failed_attempts = {}
    MAX_ATTEMPTS = 5
    LOCKOUT_TIME = 15 * 60  # 15 minutes in seconds
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            consumer_id = serializer.validated_data['consumer_id']
            password = serializer.validated_data['password']
            
            # Check for rate limiting
            if self.is_rate_limited(consumer_id):
                return Response({
                    "success": False,
                    "message": "Too many failed attempts. Please try again later."
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)
            
            try:
                user = User.objects.get(consumer_id=consumer_id)
                
                # Check if user is using current temp password
                if not user.check_password(password):
                    self.record_failed_attempt(consumer_id)
                    return Response({
                        "success": False,
                        "message": "Invalid credentials"
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Check if email is verified
                if not user.is_email_verified:
                    return Response({
                        "success": False,
                        "message": "Please verify your email before logging in"
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Check if using OTP and if it's expired
                try:
                    otp = OneTimePassword.objects.filter(
                        user=user,
                        is_used=False
                    ).latest('created_at')
                    
                    # Check if OTP has expired
                    if otp.expires_at < timezone.now():
                        return Response({
                            "success": False,
                            "message": "Your temporary password has expired. Please request a new one."
                        }, status=status.HTTP_401_UNAUTHORIZED)
                    
                    # Mark OTP as used
                    otp.is_used = True
                    otp.save()
                except OneTimePassword.DoesNotExist:
                    # Not using OTP, continue normally
                    pass
                
                # Reset failed login attempts
                if consumer_id in self.failed_attempts:
                    del self.failed_attempts[consumer_id]
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                # Send login notification email
                self.send_login_notification(user)
                
                return Response({
                    "success": True,
                    "message": "Login successful",
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    "user": UserSerializer(user).data,
                    "require_face_verification": not user.is_face_verified
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                self.record_failed_attempt(consumer_id)
                return Response({
                    "success": False,
                    "message": "Invalid credentials"
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def is_rate_limited(self, consumer_id):
        if consumer_id in self.failed_attempts:
            attempts, timestamp = self.failed_attempts[consumer_id]
            # Check if lockout period has passed
            if attempts >= self.MAX_ATTEMPTS and (timezone.now().timestamp() - timestamp) < self.LOCKOUT_TIME:
                return True
            # Reset if lockout period passed
            elif attempts >= self.MAX_ATTEMPTS:
                del self.failed_attempts[consumer_id]
        return False
    
    def record_failed_attempt(self, consumer_id):
        now = timezone.now().timestamp()
        if consumer_id in self.failed_attempts:
            attempts, _ = self.failed_attempts[consumer_id]
            self.failed_attempts[consumer_id] = (attempts + 1, now)
        else:
            self.failed_attempts[consumer_id] = (1, now)
    
    def send_login_notification(self, user):
        try:
            subject = "Login Notification - Pay Flow"
            login_time = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
            message = f"""
            Hello {user.full_name},
            
            We detected a new login to your Pay Flow account.
            
            Time: {login_time}
            
            If this was you, no action is needed. If you didn't login, please secure your account immediately.
            
            Best Regards,
            The Pay Flow Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            logger.info(f"Login notification email sent to {user.email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send login notification email: {str(e)}")
            return False

class FaceVerificationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = FaceImageSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            image = serializer.validated_data['image']
            
            # Save face verification image
            face_verification = FaceVerification.objects.create(
                user=user,
                image=image
            )
            
            # In a real application, you would use a facial recognition service here
            # For this example, we'll just mark it as verified
            face_verification.is_verified = True
            face_verification.save()
            
            # Mark user as face verified
            user.is_face_verified = True
            user.save()
            
            return Response({
                "success": True,
                "message": "Face verification successful"
            }, status=status.HTTP_200_OK)
        
        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Add an endpoint for email verification
@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    try:
        # Find user with this verification token
        user = User.objects.get(
            verification_token=token,
            verification_expires__gt=timezone.now()
        )
        
        # Mark email as verified
        user.is_email_verified = True
        user.verification_token = None
        user.verification_expires = None
        user.save()
        
        return Response({
            "success": True,
            "message": "Email verified successfully. You can now log in."
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            "success": False,
            "message": "Invalid or expired verification token."
        }, status=status.HTTP_400_BAD_REQUEST)
    
class CompleteRegistrationWithFaceView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Get token and consumer_id from request
        token = request.data.get('face_verification_token')
        consumer_id = request.data.get('consumer_id')
        face_image = request.data.get('face_image')
        
        if not token or not consumer_id or not face_image:
            return Response({
                "success": False,
                "message": "Missing required information",
                "errors": {
                    "token": ["Required if token is missing"],
                    "consumer_id": ["Required if consumer_id is missing"],
                    "face_image": ["Required if face_image is missing"]
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find user with this token and consumer_id
            user = User.objects.get(
                consumer_id=consumer_id,
                face_verification_token=token,
                face_verification_expires__gt=timezone.now()
            )
            
            # Process the face image
            self.save_face_image(face_image, user)
            
            # Clear the verification token
            user.face_verification_token = None
            user.face_verification_expires = None
            user.is_face_verified = True  # In a real app, this would be done after actual verification
            user.save()
            
            return Response({
                "success": True,
                "message": "Face verification completed successfully. You can now log in.",
                "redirect_to": "/login"  # Front-end can use this to redirect
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "Invalid or expired verification token."
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def save_face_image(self, image_data, user):
        """
        Saves the face image with the consumer_id as the filename
        """
        try:
            # Handle base64 encoded image
            if isinstance(image_data, str) and image_data.startswith('data:image'):
                # Extract the base64 part
                format, imgstr = image_data.split(';base64,')
                ext = format.split('/')[-1]
                
                # Decode the base64 string
                import base64
                from django.core.files.base import ContentFile
                
                # Create the file with consumer_id as the name
                filename = f"{user.consumer_id}.{ext}"
                image_content = ContentFile(base64.b64decode(imgstr), name=filename)
                
                # Create a FaceVerification record
                face_verification = FaceVerification.objects.create(
                    user=user,
                    is_verified=True  # In a real app, this would be set after verification
                )
                
                # Save the image to the face_verification model
                face_verification.image.save(filename, image_content)
                face_verification.save()
            else:
                # If it's a file upload
                filename = f"{user.consumer_id}.{image_data.name.split('.')[-1]}"
                
                # Create a FaceVerification record
                face_verification = FaceVerification.objects.create(
                    user=user,
                    is_verified=True  # In a real app, this would be set after verification
                )
                
                # Save the image
                face_verification.image.save(filename, image_data)
                face_verification.save()
                
            logger.info(f"Face image saved successfully for user {user.consumer_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to save face image: {str(e)}")
            return False
