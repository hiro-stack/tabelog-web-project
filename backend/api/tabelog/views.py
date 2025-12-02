import json
import os
import csv
import shutil
from django.conf import settings
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .tabelog_app_manipulater.app import Application
from .models import TabelogRecord


@method_decorator(csrf_exempt, name="dispatch")
class TabelogView(View):

    def post(self, request):
        """Next.js → Application実行 → CSV → DB保存 → URL返却"""

        # ---- 1. JSON受け取り ----
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

        # ---- 2. Application 実行 ----
        try:
            app = Application(
                current_location=body["current_location"],
                areas=body["areas"],
                menus=body["menus"],
                votes_result=body["votes_result"],
                alpha=body["alpha"],
                weight=body["weight"],
                max_minutes=body["max_minutes"],
                price_max=body["price_max"],
                time_is=body["time_is"],
            )
            app.main()
        except Exception as e:
            return JsonResponse({"error": f"Application Error: {str(e)}"}, status=500)

        # ---- 3. File path based on Application output ----
        base_dir = os.path.dirname(__file__)
        result_dir = os.path.join(
            base_dir, "tabelog_app_manipulater", "tabelog_system", "data", "result_data"
        )

        csv_path = os.path.join(result_dir, "result_data.csv")
        html_path = os.path.join(result_dir, "mapping.html")

        # ---- 4. media/ にコピー (公開用) ----
        # ---- 0. 既存 mediaフォルダ削除 ----
        if os.path.exists(settings.MEDIA_ROOT):
            shutil.rmtree(settings.MEDIA_ROOT)

        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)

        csv_media_path = os.path.join(settings.MEDIA_ROOT, "result_data.csv")
        html_media_path = os.path.join(settings.MEDIA_ROOT, "result_map.html")

        if os.path.exists(csv_path):
            shutil.copy(csv_path, csv_media_path)

        if os.path.exists(html_path):
            shutil.copy(html_path, html_media_path)

        csv_url = settings.MEDIA_URL + "result_data.csv"
        html_url = settings.MEDIA_URL + "result_map.html"

        # ---- 5. CSV → DB保存 ----
        if not os.path.exists(csv_path):
            return JsonResponse({"error": "CSV not found"}, status=500)

        # DB初期化（必要なら）
        TabelogRecord.objects.all().delete()

        with open(csv_path, encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                TabelogRecord.objects.create(
                    score=row.get("点数") or "",
                    name=row.get("店名") or "",
                    star_rating=row.get("星5段階評価") or "",
                    price=row.get("価格") or "",
                    category=row.get("項目") or "",
                    walk_time=row.get("現在地点からの徒歩(分)") or "",
                    voice_volume=row.get("声の大きさ") or "",
                    latitude=row.get("緯度") or "",
                    longitude=row.get("経度") or "",
                )

        # ---- 6. DB結果をレスポンス用として取得 ----
        records = list(
            TabelogRecord.objects.values(
                "name",
                "score",
                "star_rating",
                "price",
                "category",
                "walk_time",
                "latitude",
                "longitude",
            )
        )

        # ---- 7. フロントに返却 ----
        return JsonResponse(
            {
                "message": "Success",
                "records": records,
                "csv_url": csv_url,
                "html_url": html_url,
            },
            json_dumps_params={"ensure_ascii": False},
            status=200,
        )

    def get(self, request):
        """動作確認"""
        return JsonResponse({"status": "OK"})
