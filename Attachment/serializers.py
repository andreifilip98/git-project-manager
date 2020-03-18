from rest_framework import serializers as sz, status
from .models import Attachment


class AttachmentSerializer(sz.ModelSerializer):

    def create(self, validated_data):
        attachment = Attachment.objects.create(
            file=validated_data['file'],
            created_by=validated_data['created_by']
        )

        attachment.save()

        return attachment

    class Meta:
        model = Attachment
        fields = ('file','created_by',)
