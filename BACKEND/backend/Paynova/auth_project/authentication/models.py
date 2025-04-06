import os
import secrets
import string
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            # Generate random password if not provided
            password = self.generate_password()
            user.set_password(password)
            user.temp_password = password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)
    
    def generate_password(self, length=12):
        """Generate a secure random password"""
        alphabet = string.ascii_letters + string.digits + string.punctuation
        return ''.join(secrets.choice(alphabet) for _ in range(length))

def face_image_path(instance, filename):
    """Generate file path for face verification images"""
    ext = filename.split('.')[-1]
    filename = f"{instance.user.id}_{secrets.token_hex(8)}.{ext}"
    return os.path.join('face_verification', filename)

class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    aadhar_number = models.CharField(max_length=12, blank=True, null=True)
    consumer_id = models.CharField(max_length=20, unique=True)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    card_number = models.CharField(max_length=16, blank=True, null=True)
    card_expiry = models.CharField(max_length=7, blank=True, null=True)
    cvv = models.CharField(max_length=3, blank=True, null=True)
    temp_password = models.CharField(max_length=100, blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)
    is_face_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    face_verification_token = models.CharField(max_length=64, null=True, blank=True)
    face_verification_expires = models.DateTimeField(null=True, blank=True)
    
   
    
    


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    objects = UserManager()
    
    def __str__(self):
        return self.email

class FaceVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='face_images')
    image = models.ImageField(upload_to=face_image_path)
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"FaceVerification for {self.user.email}"

class OneTimePassword(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"OTP for {self.user.email}"

# authentication/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FaceVerification, OneTimePassword
import base64
from django.core.files.base import ContentFile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'aadhar_number', 
                 'consumer_id', 'bank_name', 'card_number', 'card_expiry',
                 'is_email_verified', 'is_face_verified']
        read_only_fields = ['is_email_verified', 'is_face_verified']

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone_number', 'aadhar_number', 
                 'consumer_id', 'bank_name', 'card_number', 'card_expiry']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class TokenRequestSerializer(serializers.Serializer):
    consumer_id = serializers.CharField(max_length=20)

class LoginSerializer(serializers.Serializer):
    consumer_id = serializers.CharField(max_length=20)
    password = serializers.CharField(max_length=128, write_only=True)

class FaceImageSerializer(serializers.Serializer):
    image = serializers.CharField()

    def validate_image(self, value):
        if not value:
            raise serializers.ValidationError("No image data provided")
        
        try:
            # Remove header and get raw base64 content
            if ';base64,' in value:
                header, base64_image = value.split(';base64,')
                file_extension = header.split('/')[1]
            else:
                base64_image = value
                file_extension = 'png'  # Default extension
            
            # Convert base64 to file
            return ContentFile(
                base64.b64decode(base64_image),
                name=f'face_image.{file_extension}'
            )
        except Exception as e:
            raise serializers.ValidationError(f"Invalid image format: {str(e)}")

class FaceVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaceVerification
        fields = ['id', 'image', 'is_verified', 'verification_date']
        read_only_fields = ['is_verified', 'verification_date']