from django.urls import path
from .views import *

urlpatterns = [
    path('create_user/', CreateUserView.as_view()),

    path('user/<function_name>', UpdateUserView.as_view()),

    path('update_user/', UpdateUserView.as_view()),
]