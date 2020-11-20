from rest_framework import serializers as sz, status
from .models import Project
from behave import *


class ProjectSerializer(sz.ModelSerializer):

    def create(self, validated_data):
        project = Project.objects.create(
            created_by=validated_data['created_by'],
            name=validated_data['name'],
            description=validated_data['description']
        )

        project.save()

        return project

    class Meta:
        model = Project
        fields = ('created_by', 'name', 'description')