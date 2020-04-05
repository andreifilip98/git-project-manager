from django.db import models
from django.contrib.auth.models import User
from attachment.models import Attachment
from project.models import Project


class Issue(models.Model):
    """ Issue model
    Fields:
        created_by - the project on which the issue has been created
        affected - the version of the project that is affected
        fix - the version of the project that needs to be fixed
        colour - Read, Green or Blue
        priority - priority of the issue High, Medium, Low
    """

    created_by = models.ForeignKey('project.Project', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1024)
    affected = models.CharField(max_length=5)
    fix = models.CharField(max_length=5)
    colour = models.CharField(max_length=10)
    priority = models.CharField(max_length=10)
    attachments = models.ManyToManyField('attachment.Attachment', related_name='issue_attachments')

    def __str__(self):
        return self.title
