from rest_framework.test import APITestCase
from rest_framework import status


class RegistrationTestCase(APITestCase):
    """testing if a project can be deleted"""

    def test_registration(self):

        project = "project1"

        response = self.client.delete("http://127.0.0.1:8000/project/delete_project/" + project)
        self.assertEqual(response.status_code, status.HTTP_301_MOVED_PERMANENTLY)


