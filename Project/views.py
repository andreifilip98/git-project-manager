from Profile.models import Profile
from Profile.serializers import ProfileSerializer
from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions
from .models import *

# Create your views here.


@api_view(['GET'])
def get_projects(request):
    projects = Project.objects.filter(created_by=Profile.objects.get(user=request.user.profile.pk))
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def get_other_projects(request):
    user = request.data['user']
    projects = Project.objects.filter(members=Profile.objects.get(pk=user))
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def get_project_pk(request):
    name = request.data['name']
    projectObject = Project.objects.get(name=name)
    return Response(projectObject.pk)


class CreateProjectView(APIView):

    permission_classes = (permissions.AllowAny, )

    def post(self, request):

        profile = ProfileSerializer(request.user.profile)
        project = request.data
        project.update({'created_by':profile.data["user"]})

        if not project:
            return Response({'response': 'error', 'message': 'No data found'})
        serializer = ProjectSerializer(data=project)
        if serializer.is_valid():
            saved_user = serializer.save()
            Profile.objects.get(id=profile.data["user"]).projects.add(Project.objects.last())
            print(Profile.objects.get(id=profile.data["user"]).projects.add(Project.objects.last()))

        else:
            return Response({"response": "error", "message": serializer.errors})
        return Response({"response": "success", "message": "project created succesfully"})
