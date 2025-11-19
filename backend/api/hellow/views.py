from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Hellow

class Backend(APIView):
    def get(self, request, format=None):
        entry = Hellow.objects.get(id=1)
        return Response({"message": entry.message})

# Create your views here.
