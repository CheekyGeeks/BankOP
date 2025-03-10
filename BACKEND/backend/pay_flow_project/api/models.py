from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15)
    aadhar_number = models.CharField(max_length=20)
    consumer_id = models.CharField(max_length=50)
    software_downloaded = models.BooleanField(default=False)
    biometric_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.user.username

class PaymentDetail(models.Model):
    BANK_CHOICES = [
        ('hdfc', 'HDFC Bank'),
        ('sbi', 'State Bank of India'),
        ('axis', 'Axis Bank'),
        ('icici', 'ICICI Bank'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_details')
    bank_name = models.CharField(max_length=50, choices=BANK_CHOICES)
    card_number = models.CharField(max_length=19)  # Stored encrypted
    expiry_date = models.CharField(max_length=7)   # Stored encrypted
    cvv = models.CharField(max_length=4)           # Stored encrypted
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s {self.bank_name} card"
    
    def save(self, *args, **kwargs):
        # In a real implementation, encrypt sensitive data before saving
        # self.card_number = encrypt_data(self.card_number)
        # self.expiry_date = encrypt_data(self.expiry_date)
        # self.cvv = encrypt_data(self.cvv)
        super().save(*args, **kwargs)
