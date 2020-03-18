from django.urls import path
from .views import *

urlpatterns = [
    path('create_user/', CreateUserView.as_view()),
    path('current_user/', get_current_user),
    path('update_user/', UpdateUserView.as_view()),
]