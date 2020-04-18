# Generated by Django 2.2.7 on 2020-04-18 11:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('issue', '0002_issue_created_by'),
        ('profile', '0001_initial'),
        ('project', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='added_on',
            field=models.ManyToManyField(related_name='added_on_project', to='project.Project'),
        ),
        migrations.AddField(
            model_name='profile',
            name='issues',
            field=models.ManyToManyField(related_name='user_issues', to='issue.Issue'),
        ),
        migrations.AddField(
            model_name='profile',
            name='projects',
            field=models.ManyToManyField(related_name='user_projects', to='project.Project'),
        ),
        migrations.AddField(
            model_name='profile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
