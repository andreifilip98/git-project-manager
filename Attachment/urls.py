from django.urls import path
from .views import *

"""
Field:
    <function_name> - having 2 get methods and 2 post methods it is used for choosing which one to be done
"""

urlpatterns = [

    path('create_attachment/', CreateAttachmentView.as_view()),
    path('update_attachments/', UpdateAttachmentView.as_view()),

    path('attachments/<function_name>', UpdateAttachmentView.as_view()),
]
