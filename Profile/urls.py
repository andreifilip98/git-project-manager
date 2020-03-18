from django.urls import path
from .views import *

urlpatterns = [
    path('current_profile/', get_current_profile),
    path('profile_pk/', get_profile_pk),

    path('add_member/', add_member),
    path('get_project_members/', get_project_members),
    path('delete_member/<project>/<member>/', UpdateProject.as_view())
]