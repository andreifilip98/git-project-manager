from django.http import Http404

from attachment.models import Attachment
from project.models import Project
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions


class CreateIssueOnFilepondView(APIView):
    """
    This class is used for creating an issue after filling it's infos and also being able to add attachment at
    the same time
    """

    permission_classes = (permissions.AllowAny,)

    def get_object(self, title):
        """Getting an issue by it's title from db"""

        try:
            return Issue.objects.get(title=title)
        except Issue.DoesNotExist:
            raise Http404

    def delete(self, request, title):
        """Deleting an issue by it's title"""

        issue = self.get_object(title)
        issue.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        """
        After filling all issue's infos, the issue will automatically be created and after that the user is
        able to add attachments on it

        When pressing the create issue button an issue will be created and an attachment will be upload on it
        """

        issue = request.data.get('issue')
        print(issue['attachments'])

        if not issue:
            return Response({'response': 'error', 'message': 'No data found'})
        serializer = IssueSerializer(data=issue)

        if serializer.is_valid():
            saved_user = serializer.save()
            Project.objects.get(id=issue['created_by']).issues.add(Issue.objects.last())
            last_issue = Issue.objects.last()
            last_attachment = Attachment.objects.last()
            Issue.objects.get(pk=last_issue.pk).attachments.add(last_attachment)

        else:
            print(serializer.errors)
            return Response({"response": "error", "message": serializer.errors})

        return Response({"response": "success", "message": "issue created successfully"})


class CreateIssueView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get_object(self, title):
        """Getting an issue by it's title"""

        try:
            return Issue.objects.get(title=title)
        except Issue.DoesNotExist:
            raise Http404

    def get(self, request, *args, **kwargs):
        """Getting an issue by it's title through kwargs in frontend url"""

        title = self.kwargs.get('title')
        issue = self.get_object(title)
        serializer = IssueSerializer(issue)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        """Delete an issue with all it's attachments"""

        if request.method == 'DELETE':
            title = self.kwargs.get('title')
            issue = Issue.objects.get(title=title)
            attachment = Attachment.objects.filter(created_by=issue)
            attachment.delete()
            issue.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        """Creating an issue without attachments on it"""

        issue = request.data.get('issue')

        if not issue:
            return Response({'response': 'error', 'message': 'No data found'})
        serializer = IssueSerializer(data=issue)

        if serializer.is_valid():
            saved_user = serializer.save()
            Project.objects.get(id=issue['created_by']).issues.add(Issue.objects.last())

        else:
            print(serializer.errors)
            return Response({"response": "error", "message": serializer.errors})

        return Response({"response": "success", "message": "issue created successfully"})


class UpdateIssueView(APIView):

    permission_classes = (permissions.AllowAny,)

    def get_issues(self, req):
        """Getting issues filtered by their priority"""

        name = req.data['name']
        project_object = Project.objects.get(name=name)
        project = project_object.pk

        issues_high_priority = Issue.objects.filter(created_by=Project.objects.get(pk=project)).filter(priority="High")
        issues_mid_priority = Issue.objects.filter(created_by=Project.objects.get(pk=project)).filter(priority="Mid")
        issues_low_priority = Issue.objects.filter(created_by=Project.objects.get(pk=project)).filter(priority="Low")

        serializer_high = IssueSerializer(issues_high_priority, many=True)
        serializer_mid = IssueSerializer(issues_mid_priority, many=True)
        serializer_low = IssueSerializer(issues_low_priority, many=True)

        serializer = serializer_high.data + serializer_mid.data + serializer_low.data
        return Response(serializer)

    def add_issue_attachments(self, req):
        """Adding attachments to current issue"""

        title = req.data['title']
        attachment = req.data['file']
        Issue.objects.get(title=title).attachments.save(attachment)
        return Response('Success!')

    def post(self, request, *args, **kwargs):
        """Choosing between posting issue with or without an attachment

        If we have an attachment request it will be created an issue with that attachment otherwise just the issue
        """

        function_called = self.kwargs.get('function_name')
        if function_called == 'get_issues':
            return self.get_issues(request)
        if function_called == 'add_issue_attachments':
            return self.add_issue_attachments(request)

        current_issue = Issue.objects.get(title=request.data.get('issueTemporaryTitle'))
        current_issue.title = request.data.get('newTitle')
        current_issue.description = request.data.get('description')
        current_issue.affected = request.data.get('affected')
        current_issue.fix = request.data.get('fix')
        current_issue.colour = request.data.get('colour')
        current_issue.priority = request.data.get('priority')

        current_issue.save()
        return Response({"response": "success", "message": "issue updated successfully"})

    def patch(self, request, *args, **kwargs):
        """Saving the issue after modifications"""

        name = self.kwargs.get('name')
        issue = Issue.objects.get(title=name)
        serializer = IssueSerializer(issue, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
