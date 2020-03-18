from django.db import models
from rest_framework_jwt.serializers import User

class User(models.Model):
    def __str__(self):
        return self
