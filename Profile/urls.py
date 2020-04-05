from django.urls import path
from .views import *

urlpatterns = [
    path('update_profile/<function_name>', UpdateProfile.as_view()),
    path('update_project/<function_name>', UpdateProject.as_view()),
    path('delete_member/<project>/<member>/', UpdateProject.as_view())
]