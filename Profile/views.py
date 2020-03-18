from django.http import Http404

from Attachment.models import Attachment
from Issue.models import Issue
from Project.models import Project
from Project.serializers import ProjectSerializer
from User.serializers import GetFullUserSerializer
from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import *


@api_view(['GET'])
def get_current_profile(request):
    serializer = ProfileSerializer(request.user.profile)
    return Response(serializer.data)


@api_view(['POST'])
def get_profile_pk(request):
    email = request.data['email']
    profileObject = User.objects.get(email=email)
    return Response(profileObject.pk)


@api_view(['POST'])
def add_member(request):
    name = request.data['name']
    projectObject = Project.objects.get(name=name)

    email = request.data['email']
    profileObject = User.objects.get(email=email)

    profile = profileObject.pk
    project = projectObject.pk
    Profile.objects.get(pk=profile).added_on.add(Project.objects.get(pk=project))
    Project.objects.get(pk=project).members.add(Profile.objects.get(pk=profile))
    return Response('Success!')


@api_view(['POST'])
def get_project_members(request):

    name = request.data['name']
    projectObject = Project.objects.get(name=name)
    # get project members as profiles and return the user corresponding to those profiles
    membersAsUserPks = []
    membersAsUserData = []
    project = projectObject.pk
    members = Profile.objects.filter(added_on=Project.objects.get(pk=project))
    for member in range(members.count()):
        serializer = ProfileSerializer(members, many=True)
        membersAsUserPks.append(serializer.data[member]['user'])

    for user_pk in membersAsUserPks:
        user = User.objects.get(pk=user_pk)
        serializer = GetFullUserSerializer(user)
        membersAsUserData.append(serializer.data)

    return Response(membersAsUserData)


class UpdateProfile(APIView):

    permission_classes = (permissions.AllowAny,)

    def delete(self, *args, **kwargs):
        project_name = self.kwargs.get('project')
        project = Project.objects.get(name=project_name)

        if Issue.objects.filter(created_by=project):
            for i in Issue.objects.filter(created_by=project):
                issues = i
                print(issues.title)
                if Attachment.objects.filter(created_by=issues.title):
                    attachments = Attachment.objects.get(created_by=issues.title)
                    attachments.delete()

        project.delete()
        return Response(status)


class UpdateProject(APIView):
    permission_classes = (permissions.AllowAny,)

    def get_object(self, name):
        try:
            return Project.objects.get(name=name)
        except Project.DoesNotExist:
            raise Http404

    def get(self, name):
        project = self.get_object(name)
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        project_name = self.kwargs.get('project')
        member_name = self.kwargs.get('member')
        print(project_name)
        print(member_name)
        project = Project.objects.get(name=project_name)
        user = User.objects.get(username=member_name)
        member = project.members.get(user=user)
        profile = Profile.objects.get(user=user)
        profile.added_on.remove(project)
        project.members.remove(member)
        return Response(status)

    def patch(self, request, *args, **kwargs):
        name = self.kwargs.get('name')
        project = self.get_object(name)
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)