from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, PaymentDetail
from biometric_auth.models import BiometricData

class PaymentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDetail
        fields = ['bank_name', 'card_number', 'expiry_date', 'cvv']
        extra_kwargs = {
            'card_number': {'write_only': True},
            'cvv': {'write_only': True},
        }

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone_number', 'aadhar_number', 'consumer_id', 'software_downloaded']

class UserRegistrationSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    payment_details = PaymentDetailSerializer()
    
    class Meta:
        model = User
        fields = ['username', 'email', 'profile', 'payment_details']
    
    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        payment_data = validated_data.pop('payment_details')
        
        # Create user
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            is_active=True
        )
        
        # Set a default password (in production, implement proper password handling)
        user.set_password('temp_password')  # In a real app, generate or request a password
        user.save()
        
        # Create user profile
        UserProfile.objects.create(user=user, **profile_data)
        
        # Create payment details
        PaymentDetail.objects.create(user=user, **payment_data)
        
        # Create empty biometric record
        BiometricData.objects.create(user=user)
        
        return user

class BiometricDataSerializer(serializers.ModelSerializer):
    face_image = serializers.CharField(write_only=True, required=False)
    fingerprint_data = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = BiometricData
        fields = ['face_image', 'fingerprint_data', 'is_verified']
        read_only_fields = ['is_verified']