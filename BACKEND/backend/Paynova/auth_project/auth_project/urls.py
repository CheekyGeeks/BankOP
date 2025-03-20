from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from authentication.views import api_root  # Import your view

urlpatterns = [
    path('api/', api_root, name='api-root'),  # Add this line
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)