from django.db import models
from django.contrib.auth.models import User
from profile.models import Profile


class Project(models.Model):

    name = models.CharField(max_length=50)
    created_by = models.ForeignKey('profile.Profile', on_delete=models.CASCADE)
    description = models.CharField(max_length=1024)
    issues = models.ManyToManyField('issue.Issue', related_name='project_issues')
    members = models.ManyToManyField('profile.Profile', related_name='project_members')

    def __str__(self):
        return self.name
