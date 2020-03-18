from rest_framework import serializers as sz, status
from .models import Issue


class IssueSerializer(sz.ModelSerializer):

    def create(self, validated_data):
        issue = Issue.objects.create(
            created_by=validated_data['created_by'],
            title=validated_data['title'],
            description=validated_data['description'],
            affected=validated_data['affected'],
            fix=validated_data['fix'],
            colour=validated_data['colour'],
            priority=validated_data['priority'],
            # attachments=validated_data['attachments']
        )

        issue.save()

        return issue

    class Meta:
        model = Issue
        fields = ('created_by', 'title', 'description', 'affected', 'fix', 'colour', 'priority')