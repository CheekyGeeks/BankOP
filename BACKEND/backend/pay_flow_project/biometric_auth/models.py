from django.db import models
from django.contrib.auth.models import User

class BiometricData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='biometric_data')
    face_template = models.BinaryField(null=True, blank=True)
    fingerprint_template = models.BinaryField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s biometric data"

class BiometricVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='biometric_verifications')
    verification_type = models.CharField(max_length=20, choices=[
        ('face', 'Face Recognition'),
        ('fingerprint', 'Fingerprint'),
    ])
    is_successful = models.BooleanField()
    verification_time = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    
    def __str__(self):
        status = "successful" if self.is_successful else "failed"
        return f"{self.user.username}'s {self.verification_type} verification ({status})"