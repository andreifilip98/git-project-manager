from django.urls import path
from .views import *

urlpatterns = [

    path('create_attachment/', CreateAttachmentView.as_view()),
    path('get_last_attachment/', get_last_attachment),
    path('update_attachments/', UpdateAttachmentView.as_view()),
    path('get_related_attachments/', get_attachments_related_to_issueTitle),
]
