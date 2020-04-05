from django.http import Http404

from issue.models import Issue
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions


class CreateAttachmentView(APIView):

    permission_classes = (permissions.AllowAny, )

    def get_object(self, file):
        """Used for getting a certain file from attachments"""

        try:
            return Attachment.objects.get(file=file)
        except Issue.DoesNotExist:
            raise Http404

    def post(self, request):
        """Creates, posts and add to db  an attachment"""

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

    def get_attachments_related_to_issueTitle(self, req):
        """Download attachment feature

            Post method used for passing the title of the issue on which the attachment was created so we can download
            that issue's attachment
        """

        attachment = Attachment.objects.get(created_by=req.data['issueTitle'])
        serializer = AttachmentSerializer(attachment)
        print(serializer.data)
        return Response(serializer.data)

    def get_last_attachment(self, req):
        """Gets the last attachment from db

            Used for making sure that before creating an attachment there is an issue on which the
            attachment will be related
        """

        attachment = Attachment.objects.last()
        attachment_pk = attachment.pk
        return Response(attachment_pk)

    def get(self, request, *args, **kwargs):
        """Make a request for downloading attachment feature"""

        function_called = self.kwargs.get('function_name')
        if function_called == 'get_last_attachment':
            return self.get_last_attachment(request)

    def post(self, request, *args, **kwargs):
        """Upload an attachment

        If the issues's infos are filed in and saved in db the user will be allowed to upload an attachment

        :param
        attachment.created_by - specify on which issue the attachment is added on

        old_created_by - refers to the first set of data filed when creating an issue because it can be modified before
        pressing the create issue button

        new_created_by - refers to the final set of data after pressing the create issue button
        """

        function_called = self.kwargs.get('function_name')
        if function_called == 'get_attachments_related_to_issueTitle':
            return self.get_attachments_related_to_issueTitle(request)

        attachment = Attachment.objects.get(created_by=request.data.get('old_created_by'))
        attachment.created_by = request.data.get('new_created_by')

        attachment.save()
        return Response({"response": "success", "message": "attachment updated successfully"})
