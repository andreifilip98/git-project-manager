from django.db import models
from django.contrib.auth.models import User
# from .models import *
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    github_account = models.CharField(max_length=120, default='')
    projects = models.ManyToManyField('Project.Project', related_name='user_projects')
    issues = models.ManyToManyField('Issue.Issue', related_name='user_issues')
    added_on = models.ManyToManyField('Project.Project', related_name='added_on_project')

    def __str__(self):
        return self.user.username