from django.urls import path
from .views import *

urlpatterns = [
    path('create_issue_with_filepond/', CreateIssueOnFilepondView.as_view()),
    path('create_issue/', CreateIssueView.as_view()),
    path('get_issues/', get_issues),
    path('update_issue/', UpdateIssueView.as_view()),
    path('update_issue_description/<name>/', UpdateIssueView.as_view()),

    path('delete_issue/<title>/', CreateIssueView.as_view()),
    path('get_issue/<title>/', CreateIssueView.as_view()),
]