from django.http import Http404

from attachment.models import Attachment
from issue.models import Issue
from project.models import Project
from project.serializers import ProjectSerializer
from user.serializers import GetFullUserSerializer
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import *


class UpdateProfile(APIView):

    permission_classes = (permissions.AllowAny,)

    def get_current_profile(self, req):
        serializer = ProfileSerializer(req.user.profile)
        return Response(serializer.data)

    def get_profile_pk(self, req):
        """Get the pk of a profile through user's model email field"""

        email = req.data['email']
        profile_object = User.objects.get(email=email)
        return Response(profile_object.pk)

    def get(self, request, *args, **kwargs):
        """Calling get_current_profile through function_name when calling the api"""

        function_called = self.kwargs.get('function_name')
        if function_called == 'get_current_profile':
            return self.get_current_profile(request)

        return Response("Incorrect function")

    def post(self, request, *args, **kwargs):
        """Used as a post to return a BODY in frontend get_profile_pk"""
        
        function_called = self.kwargs.get('function_name')
        if function_called == 'get_profile_pk':
            return self.get_profile_pk(request)

        return Response("Incorrect function")

    def delete(self, *args, **kwargs):
        """Delete a certain project with all it's issues and attachment

        :param
        project_name - name of the project passed through api url

        Deleting on cascade beginning with issue's attachments followed by actual issues and the project's are on
        """

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

    def add_member(self, req):
        """Adding a member on a project by their email and name and also specify it as added on the project

        :param
        name & email - the name and email of the user, fetched through body's request from api call in frontend

        After searching the project and user's profile by their pk, it specify in user's Profile on which project
        it is added on and also specify it on the project's member list
        """

        name = req.data['name']
        project_object = Project.objects.get(name=name)

        email = req.data['email']
        profile_object = User.objects.get(email=email)

        profile = profile_object.pk
        project = project_object.pk
        Profile.objects.get(pk=profile).added_on.add(Project.objects.get(pk=project))
        Project.objects.get(pk=project).members.add(Profile.objects.get(pk=profile))
        return Response('Success!')

    def get_project_members(self, req):
        """Get members of a project by their user model

        :param
        name - name of the project fetched through body's request in api call
        members_as_user_pks - list with all user's pk that are part of the project
        members_as_user_data - list with all user's data that are part of the project

        :returns
        A response containing all members from a project by their user model
        """

        name = req.data['name']
        project_object = Project.objects.get(name=name)
        members_as_user_pks = []
        members_as_user_data = []
        project = project_object.pk

        # Filtering users's profiles by the projects they are added on
        members = Profile.objects.filter(added_on=Project.objects.get(pk=project))

        # Taking all the members from a given project by their user's primary key
        for member in range(members.count()):
            serializer = ProfileSerializer(members, many=True)
            members_as_user_pks.append(serializer.data[member]['user'])

        # Get project members with all their data from user model and add them in a list
        for user_pk in members_as_user_pks:
            user = User.objects.get(pk=user_pk)
            serializer = GetFullUserSerializer(user)
            members_as_user_data.append(serializer.data)

        return Response(members_as_user_data)

    def get_object(self, name):
        """Get a project by it's name from db"""

        try:
            return Project.objects.get(name=name)
        except Project.DoesNotExist:
            raise Http404

    def get(self, name):
        """Get method used in api call in frontend for project fetching"""

        project = self.get_object(name)
        serializer = ProjectSerializer(project)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """Deciding which post method to be done through function_name parameter given in api url"""

        function_called = self.kwargs.get('function_name')
        if function_called == 'add_member':
            return self.add_member(request)
        if function_called == 'get_project_members':
            return self.get_project_members(request)

        return Response("Incorrect function name")

    def delete(self, request, *args, **kwargs):
        """Deleting members from a specific project

        :param
        project_name - name of the project passed through api url
        member_name - name of the member to be deleted passed through api url

        project - the actual project
        user - the user that is linked to the members's profile to be deleted
        profile - the actual member's profile


        Removing the project on which the members was part of. This will be done by removing the
        project from added_on field from profile model

        Removing the profile from the project's member list
        """

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
        """Used for modifying project infos
        :param
        name - the name of the project passed through api url

        After modifying the project's infos like description or title it is used for saving those changes
        """

        name = self.kwargs.get('name')
        project = self.get_object(name)
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
