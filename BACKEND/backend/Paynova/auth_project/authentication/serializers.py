from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import FaceVerification, OneTimePassword
import base64
import re
from django.core.files.base import ContentFile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'aadhar_number', 
                 'consumer_id', 'bank_name', 'card_number', 'card_expiry',
                 'is_email_verified', 'is_face_verified', 'created_at', 'updated_at']
        read_only_fields = ['id', 'email', 'is_email_verified', 'is_face_verified', 'created_at', 'updated_at']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone_number', 'aadhar_number', 
                 'consumer_id', 'bank_name', 'card_number', 'card_expiry', 'password']
        extra_kwargs = {
            'email': {'required': True},
            'full_name': {'required': True},
            'consumer_id': {'required': True}
        }
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value
    
    def validate_consumer_id(self, value):
        if User.objects.filter(consumer_id=value).exists():
            raise serializers.ValidationError("Consumer ID already registered")
        return value
    
    def validate_phone_number(self, value):
        if value and not re.match(r'^\d{10,15}$', value):
            raise serializers.ValidationError("Phone number must be between 10 and 15 digits")
        return value
    
    def validate_aadhar_number(self, value):
        if value and not re.match(r'^\d{12}$', value):
            raise serializers.ValidationError("Aadhar number must be 12 digits")
        return value
    
    def validate_card_number(self, value):
        if not value:
            return value
            
        # Remove spaces and dashes
        cleaned = re.sub(r'[\s-]', '', value)
        if not re.match(r'^\d{13,19}$', cleaned):
            raise serializers.ValidationError("Invalid card number format")
        
        # Luhn algorithm for card validation
        digits = [int(d) for d in cleaned]
        checksum = 0
        for i, digit in enumerate(reversed(digits)):
            if i % 2 == 1:
                digit *= 2
                if digit > 9:
                    digit -= 9
            checksum += digit
        if checksum % 10 != 0:
            raise serializers.ValidationError("Invalid card number checksum")
        
        return cleaned
    
    def validate_card_expiry(self, value):
        if value and not re.match(r'^(0[1-9]|1[0-2])/\d{2}$', value):
            raise serializers.ValidationError("Card expiry must be in MM/YY format")
            
        # Check if card hasn't expired
        if value:
            try:
                import datetime
                month, year = value.split('/')
                expiry_date = datetime.datetime(2000 + int(year), int(month), 1)
                current_date = datetime.datetime.now()
                if expiry_date < current_date:
                    raise serializers.ValidationError("Card has expired")
            except Exception:
                raise serializers.ValidationError("Invalid expiry date")
                
        return value
    
    def validate_password(self, value):
        if value:
            try:
                validate_password(value)
            except ValidationError as e:
                raise serializers.ValidationError(list(e.messages))
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(password=password, **validated_data)
        return user

class TokenRequestSerializer(serializers.Serializer):
    consumer_id = serializers.CharField(max_length=20)
    
    def validate_consumer_id(self, value):
        if not User.objects.filter(consumer_id=value).exists():
            raise serializers.ValidationError("No account found with this Consumer ID")
        return value

class LoginSerializer(serializers.Serializer):
    consumer_id = serializers.CharField(max_length=20)
    password = serializers.CharField(max_length=128, write_only=True)

class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
    def validate_new_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

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
            
            # Validate base64 content
            try:
                base64.b64decode(base64_image)
            except Exception:
                raise serializers.ValidationError("Invalid base64 encoding")
            
            # Convert base64 to file
            return ContentFile(
                base64.b64decode(base64_image),
                name=f'face_image.{file_extension}'
            )
        except Exception as e:
            raise serializers.ValidationError(f"Invalid image format: {str(e)}")

class FaceVerificationSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FaceVerification
        fields = ['id', 'image', 'image_url', 'is_verified', 'verification_date']
        read_only_fields = ['is_verified', 'verification_date']
        extra_kwargs = {
            'image': {'write_only': True}
        }
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class OneTimePasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = OneTimePassword
        fields = ['id', 'created_at', 'expires_at', 'is_used']
        read_only_fields = ['id', 'created_at', 'expires_at', 'is_used']