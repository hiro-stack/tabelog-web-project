from django.urls import path
from .views import Backend

urlpatterns = [
    path('backend/', Backend.as_view()),
]
