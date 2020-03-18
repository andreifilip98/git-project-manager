# import newdoc as newdoc
from django.db import models
from django.contrib.auth.models import User
from Profile.models import Profile


class Project(models.Model):
    name = models.CharField(max_length=50, default='')
    created_by = models.ForeignKey('Profile.Profile', on_delete=models.CASCADE, default='')
    description = models.CharField(max_length=1024, default='')
    issues = models.ManyToManyField('Issue.Issue', related_name='project_issues')
    members = models.ManyToManyField('Profile.Profile', related_name='project_members')

    def __str__(self):
        return self.name
