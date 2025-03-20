from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, FaceVerification, OneTimePassword

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'consumer_id', 'is_email_verified', 'is_face_verified', 'is_staff')
    search_fields = ('email', 'full_name', 'consumer_id', 'phone_number', 'aadhar_number')
    list_filter = ('is_email_verified', 'is_face_verified', 'is_staff', 'is_active', 'created_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('full_name', 'phone_number', 'aadhar_number')}),
        (_('Payment Details'), {'fields': ('consumer_id', 'bank_name', 'card_number', 'card_expiry')}),
        (_('Verification Status'), {'fields': ('is_email_verified', 'is_face_verified')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'consumer_id', 'password1', 'password2'),
        }),
    )

@admin.register(FaceVerification)
class FaceVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_verified', 'verification_date')
    list_filter = ('is_verified', 'verification_date')
    search_fields = ('user__email', 'user__full_name', 'user__consumer_id')
    readonly_fields = ('verification_date',)

@admin.register(OneTimePassword)
class OneTimePasswordAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'expires_at', 'is_used')
    list_filter = ('is_used', 'created_at', 'expires_at')
    search_fields = ('user__email', 'user__full_name', 'user__consumer_id')
    readonly_fields = ('created_at', 'expires_at')
    
    def has_change_permission(self, request, obj=None):
        # Prevent editing one-time passwords for security reasons
        return False
