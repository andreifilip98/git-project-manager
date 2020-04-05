from profile.serializers import ProfileSerializer
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import *


class CreateProjectView(APIView):

    permission_classes = (permissions.AllowAny, )

    def get_other_projects(self, req):
        """Get the projects an user is a member of

        It is used as a post method to get the request through body's api call
        """

        user = req.data['user']
        projects = Project.objects.filter(members=Profile.objects.get(pk=user))
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def get_project_pk(self, req):
        """Get the project's primary key

        It is used as a post method to get the request through body's api call
        """

        name = req.data['name']
        project_object = Project.objects.get(name=name)
        return Response(project_object.pk)

    def get_projects(self, req):
        """Get projects for a specific user"""

        projects = Project.objects.filter(created_by=Profile.objects.get(user=req.user.profile.pk))
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def get(self, request, *args, **kwargs):
        """Calling get_projects custom method through get api method"""

        function_called = self.kwargs.get('function_name')
        if function_called == 'get_projects':
            return self.get_projects(request)

        return Response("Not entered in any if!")

    def post(self, request, *args, **kwargs):
        """Create and post a user's project"""

        function_called = self.kwargs.get('function_name')
        if function_called == 'get_other_projects':
            return self.get_other_projects(request)
        if function_called == 'get_project_pk':
            return self.get_project_pk(request)

        profile = ProfileSerializer(request.user.profile)
        project = request.data
        project.update({'created_by': profile.data["user"]})

        if not project:
            return Response({'response': 'error', 'message': 'No data found'})
        serializer = ProjectSerializer(data=project)
        if serializer.is_valid():
            saved_user = serializer.save()
            Profile.objects.get(id=profile.data["user"]).projects.add(Project.objects.last())
            print(Profile.objects.get(id=profile.data["user"]).projects.add(Project.objects.last()))

        else:
            return Response({"response": "error", "message": serializer.errors})
        return Response({"response": "success", "message": "project created successfully"})
