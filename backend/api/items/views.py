from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Item
from .serializers import ItemSerializer

class Backend(APIView):

    # GET /api/hello/
    def get(self, request, format=None):
        # 全オブジェクトを取得
        items = Item.objects.all()
        # シリアライザでシリアライズ（many=True がポイント）
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    # POST /api/hello/
    def post(self, request, format=None):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
