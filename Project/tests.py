from rest_framework.test import APITestCase
from rest_framework import status


class RegistrationTestCase(APITestCase):
    """test create project funcionality"""

    def test_create_project(self):

        response = self.client.post("http://127.0.0.1:8000/project/create_project/", {"created_by": 1, "name":
            "project1", "description": "project of the year"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_projects(self):

        response = self.client.get("http://127.0.0.1:8000/project/project/get_projects", format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

