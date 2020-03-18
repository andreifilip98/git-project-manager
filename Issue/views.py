from django.http import Http404

from Attachment.models import Attachment
from Project.models import Project
from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions


@api_view(['POST'])
def get_issues(request):
    name = request.data['name']
    projectObject = Project.objects.get(name=name)
    project = projectObject.pk
    issues_high_priority = Issue.objects.filter(created_by=Project.objects.get(pk=project)).filter(priority="High")
    issues_mid_priority = Issue.objects.filter(created_by=Project.objects.get(pk=project)).filter(priority="Mid")
    issues_low_priority = Issue.objects.filter(created_by=Project.objects.get(pk=project)).filter(priority="Low")
    serializer_high = IssueSerializer(issues_high_priority, many=True)
    serializer_mid = IssueSerializer(issues_mid_priority, many=True)
    serializer_low = IssueSerializer(issues_low_priority, many=True)
    serializer = serializer_high.data + serializer_mid.data + serializer_low.data
    return Response(serializer)


@api_view(['POST'])
def add_issue_attachments(request):
    title = request.data['title']
    attachment = request.data['file']
    Issue.objects.get(title=title).attachments.save(attachment)
    return Response('Success!')


class CreateIssueOnFilepondView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get_object(self, title):
        try:
            return Issue.objects.get(title=title)
        except Issue.DoesNotExist:
            raise Http404

    def delete(self, request, title):
        issue = self.get_object(title)
        issue.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):

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
    permission_classes = (permissions.AllowAny, )

    def get_object(self, title):
        try:
            return Issue.objects.get(title=title)
        except Issue.DoesNotExist:
            raise Http404

    def get(self, request,  *args, **kwargs):
        title = self.kwargs.get('title')
        issue = self.get_object(title)
        serializer = IssueSerializer(issue)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        if request.method == 'DELETE':
            title = self.kwargs.get('title')
            # att = Issue.objects.get(title=title).attachments
            issue = Issue.objects.get(title=title)
            attachment = Attachment.objects.filter(created_by=issue)
            attachment.delete()
            issue.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request):

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

    permission_classes = (permissions.AllowAny, )

    def post(self, request):
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
        name = self.kwargs.get('name')
        issue = Issue.objects.get(title=name)
        serializer = IssueSerializer(issue, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)