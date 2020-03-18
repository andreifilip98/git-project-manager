# import newdoc as newdoc
from django.db import models
from django.contrib.auth.models import User

from Attachment.models import Attachment
from Project.models import Project


class Issue(models.Model):

    created_by = models.ForeignKey('Project.Project', on_delete=models.CASCADE, default='')
    title = models.CharField(max_length=100, default='')
    description = models.CharField(max_length=1024, default='')
    affected = models.CharField(max_length=5, default='')
    fix = models.CharField(max_length=5, default='')
    colour = models.CharField(max_length=10, default='')
    priority = models.CharField(max_length=10, default='')
    attachments = models.ManyToManyField('Attachment.Attachment', related_name='issue_attachments')

    def __str__(self):
        return self.title
