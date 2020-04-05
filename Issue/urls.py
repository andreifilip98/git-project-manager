from django.urls import path
from .views import *

"""
Paths:
    create_issue_with_filepond - used for creating the issue before hitting the DONE button so you can
        add also on attachment on an already existing issue
        
    <function_name> - having more POST methods in views, it is used for deciding which one to be called
    
    <name> & <title> - both refer to the issue title which will be passed in frontend 
"""

urlpatterns = [
    path('create_issue_with_filepond/', CreateIssueOnFilepondView.as_view()),
    path('create_issue/', CreateIssueView.as_view()),

    path('issue/<function_name>', UpdateIssueView.as_view()),

    path('update_issue/', UpdateIssueView.as_view()),
    path('update_issue_description/<name>/', UpdateIssueView.as_view()),

    path('delete_issue/<title>/', CreateIssueView.as_view()),
    path('get_issue/<title>/', CreateIssueView.as_view()),
]