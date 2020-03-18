from django.urls import path

from Profile.views import UpdateProject, UpdateProfile
from .views import *

urlpatterns = [
    path('create_project/', CreateProjectView.as_view()),
    path('get_projects/', get_projects),
    path('update_project/<name>/', UpdateProject.as_view()),
    path('get_other_projects/', get_other_projects),
    path('get_project_pk/', get_project_pk),

    path('delete_project/<project>/', UpdateProfile.as_view()),
]