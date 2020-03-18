from django.http import Http404

from Issue.models import Issue
from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions


@api_view(['POST'])
def get_attachments_related_to_issueTitle(request):
    attachment = Attachment.objects.get(created_by=request.data['issueTitle'])
    serializer = AttachmentSerializer(attachment)
    print(serializer.data)
    return Response(serializer.data)


@api_view(['GET'])
def get_last_attachment(request):
    attachment = Attachment.objects.last()
    attachment_pk = attachment.pk
    return Response(attachment_pk)


class CreateAttachmentView(APIView):

    permission_classes = (permissions.AllowAny, )

    def get_object(self, file):
        try:
            return Attachment.objects.get(file=file)
        except Issue.DoesNotExist:
            raise Http404

    def post(self, request):
        print(request.data)
        attachment = request.data

        if not attachment:
            return Response({'response': 'error', 'message': 'No data found'})
        print(attachment)
        serializer = AttachmentSerializer(data=attachment)

        if serializer.is_valid():
            saved_user = serializer.save()
            try:
                Attachment.objects.add(attachment)
            except:
                return Response({"response": "success", "message": "attachment created succesfully"})


class UpdateAttachmentView(APIView):

    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        attachment = Attachment.objects.get(created_by=request.data.get('old_created_by'))
        attachment.created_by = request.data.get('new_created_by')

        attachment.save()
        return Response({"response": "success", "message": "attachment updated successfully"})
