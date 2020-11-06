from django.contrib.auth.models import User

from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status


class RegistrationTestCase(APITestCase):
    """test if the registration process is done right and it contains all the infos needed about the user"""

    def setUp(self):
        self.user = User.objects.create_user(
            email="asd@localhot.com",
            username="asd",
            first_name="asd",
            last_name="asd",
            password="asd",
        )

        self.token = Token.objects.create(user=self.user)
        self.api_authentication()

    """different token is generated every registration time"""
    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        print(self.token)

    def test_registration(self):

        data = {"email": "testcase@localhost.app", "username": "testcase", "first_name": "testcase",
                "last_name": "testcase",
                "password": "testcase"}

        response = self.client.post("http://127.0.0.1:8000/user/create_user/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LogInTest(APITestCase):

    def setUp(self):
        self.credentials = {
            'username': 'filip',
            'password': 'filip'}
        User.objects.create_user(**self.credentials)

    def test_login(self):
        # send login data
        response = self.client.post('http://127.0.0.1:8000/token-auth/', self.credentials, follow=True)
        # should be logged in now
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response)