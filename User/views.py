from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions


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

    def get_current_user(self, req):
        serializer = GetFullUserSerializer(req.user)
        return Response(serializer.data)

    def get(self, request, *args, **kwargs):
        """Get all current user's infos"""

        function_called = self.kwargs.get('function_name')
        if function_called == 'get_current_user':
            return self.get_current_user(request)

    def post(self, request):
        """Post all user's data and pass them to Profile model

        Because user model doesn't provide all the data we need from an actual user of the app, we created a Profile
        model which will contain the default user model and all the other infos we need
        """

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
        current_user.profile.git_token = request.data.get('git_token')

        current_user.save()
        return Response({"response": "success", "message": "user updated successfully"})