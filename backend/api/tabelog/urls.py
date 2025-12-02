from django.urls import path
from .views import TabelogView

urlpatterns = [
    path('run/', TabelogView.as_view()),
]