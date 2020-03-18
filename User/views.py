from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions


@api_view(['GET'])
def get_current_user(request):
    serializer = GetFullUserSerializer(request.user)
    return Response(serializer.data)


class CreateUserView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        user = request.data.get('user')
        if not user:
            return Response({'response': 'error', 'message': 'No data found'})
        serializer = UserSerializerWithToken(data=user)
        if serializer.is_valid():
            saved_user = serializer.save()
        else:
            return Response({"response": "error", "message": serializer.errors})
        return Response({"response": "success", "message": "user created succesfully"})


class UpdateUserView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        current_user = User.objects.get(username=request.data.get('old_username'))
        current_user.username = request.data.get('username')
        current_user.first_name = request.data.get('first_name')
        current_user.last_name = request.data.get('last_name')
        current_user.email = request.data.get('email')

        current_user.profile.username = request.data.get('username')
        current_user.profile.first_name = request.data.get('first_name')
        current_user.profile.last_name = request.data.get('last_name')
        current_user.profile.email = request.data.get('email')
        current_user.profile.github_account = request.data.get('github')

        current_user.save()
        return Response({"response": "success", "message": "user updated succesfully"})