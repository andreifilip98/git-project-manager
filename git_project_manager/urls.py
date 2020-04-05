"""git_project_manager URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_jwt.views import obtain_jwt_token
from git_project_manager.views import home

urlpatterns = [
    path('', home, name='home'),
    path('admin/doc/', include('django.contrib.admindocs.urls')),
    path('admin/', admin.site.urls),
    path('token-auth/', obtain_jwt_token),
    path('user/', include('user.urls')),
    path('profile/', include('profile.urls')),
    path('project/', include('project.urls')),
    path('issue/', include('issue.urls')),
    path('attachment/', include('attachment.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
