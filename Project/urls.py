from django.urls import path

from profile.views import UpdateProject, UpdateProfile
from .views import *

"""
Fields:
    <name> & <project> - both are used for project references
    <function_name> - decides with api will be used 
"""

urlpatterns = [
    path('create_project/', CreateProjectView.as_view()),
    path('update_project/<name>/', UpdateProject.as_view()),

    path('project/<function_name>', CreateProjectView.as_view()),

    path('delete_project/<project>/', UpdateProfile.as_view()),
]