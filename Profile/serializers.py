from rest_framework import serializers as sz
from rest_framework_jwt.serializers import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile


class ProfileSerializer(sz.ModelSerializer):

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()

    class Meta:
        model = Profile
        fields = ('user', 'projects', 'issues', 'added_on', 'git_token',)