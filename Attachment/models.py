from django.db import models
from django.contrib.auth.models import User


class Attachment(models.Model):

    """
    This model is used for storing attachments on Project's Issues.

    Fields:
    created_by - name of the issue on which the attachment is created
    file - the file itself could be any type of file and it will be uploaded to a local folder named 'attachments'
    """

    created_by = models.CharField(max_length=50)
    file = models.FileField(upload_to='attachments/')

    def __str__(self):
        return self.file.name
