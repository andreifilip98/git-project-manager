# import newdoc as newdoc
from django.db import models
from django.contrib.auth.models import User


class Attachment(models.Model):

    created_by = models.CharField(max_length=50, default='')
    file = models.FileField(upload_to='attachments/')

    def __str__(self):
        return self.file.name
