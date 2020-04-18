from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    """ The profile of the user
    Fields:
        user - references to built in model user
        github_account - used for entering the github account field
        added_on - the list of project the user is part of
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    github_account = models.CharField(max_length=120)
    projects = models.ManyToManyField('project.Project', related_name='user_projects')
    issues = models.ManyToManyField('issue.Issue', related_name='user_issues')
    added_on = models.ManyToManyField('project.Project', related_name='added_on_project')
    git_token = models.CharField(max_length=50, default='')

    def __str__(self):
        return self.user.username