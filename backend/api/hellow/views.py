from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

class Backend(APIView):
    def get(self, request):
        return Response({"message": "Hello from the backend!"})

# Create your views here.
