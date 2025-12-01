import json
from django.http import JsonResponse
from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import os, csv

from .tabelog_app_manipulater.app import Application
from .models import TabelogRecord


# これは CSRF トークン不要にするデコレータ→Djangoへのアクセスの時に誰が使ったかを確認しないようにする設定


@method_decorator(csrf_exempt, name="dispatch")
class TabelogView(View):

    def post(self, request):
        """Next.js から送られた JSON を Application に渡して実行"""

        # ---- 1. JSONの受け取り ----
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

        # ---- 2. 必須キーは揃っている前提（フロントで整えているため）----
        required_keys = [
            "current_location", "areas", "menus", "votes_result",
            "alpha", "weight", "max_minutes", "price_max", "time_is"
        ]

        missing = [key for key in required_keys if key not in body]
        if missing:
            return JsonResponse(
                {"error": f"Missing required fields: {missing}"}, 
                status=400
            )

        # ---- 3. Applicationにデータを渡して実行 ----
        try:
            application = Application(
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

            # Application側のメイン処理実行
            result = application.main()

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        # ---- 4. フロントに返す ----
        return JsonResponse(
            {"message": "Success", "result": result},
            status=200,
            json_dumps_params={"ensure_ascii": False},
        )


    def get(self, request):
        """GETは動作テスト用：固定データでApplicationを実行"""

        payload = {
            "current_location": {"name": "現在地", "latitude": 35.0, "longitude": 139.0},
            "areas": ["北千住"],
            "menus": ["ラーメン"],
            "votes_result": {"ラーメン": [5, 4]},
            "alpha": 0.5,
            "weight": {"distance": 1.0, "budget": 1.1, "evaluate": 1.2},
            "max_minutes": 30,
            "price_max": 2000,
            "time_is": "lunch",
        }

        application = Application(**payload)
        result = application.main()

        return JsonResponse(
            {"message": "Demo Run OK", "result": result},
            json_dumps_params={"ensure_ascii": False}
        )

    def run_tabelog(
        self,
        current_location,
        areas,
        menus,
        votes_result,
        alpha,
        weight,
        max_minutes,
        price_max,
        time_is,
    ):
        """共通処理：Application 実行 → CSV 読み込み → DB 保存"""

        # 1) Application 実行
        application = Application(
            current_location=current_location,
            areas=areas,
            menus=menus,
            votes_result=votes_result,
            alpha=alpha,
            weight=weight,
            max_minutes=max_minutes,
            price_max=price_max,
            time_is=time_is,
        )
        application.main()

        # 2) CSV パス
        base_dir = os.path.dirname(__file__)
        csv_path = os.path.join(
            base_dir,
            "tabelog_app_manipulater",
            "tabelog_system",
            "data",
            "result_data",
            "result_data.csv",
        )

        if not os.path.exists(csv_path):
            return JsonResponse({"error": "CSV が見つかりません"}, status=404)

        # 3) DB クリア
        TabelogRecord.objects.all().delete()

        print("今からCSVファイルを開きます")

        # 4) csvファイルを開き、モデルに入れてMYSQLに保存
        # <- utf-8-sig で BOM を自動除去
        with open(csv_path, encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                print(row)
                TabelogRecord.objects.create(
                    score=row.get("点数", "N/A"),
                    name=row.get("店名", "N/A"),
                    star_rating=row.get("星5段階評価", "N/A"),
                    price=row.get("価格", "N/A"),
                    category=row.get("項目", "N/A"),
                    walk_time=row.get("現在地点からの徒歩(分)", "N/A"),
                    voice_volume=row.get("声の大きさ", "N/A"),
                    latitude=row.get("緯度", "N/A"),
                    longitude=row.get("経度", "N/A"),
                )

        return JsonResponse({"message": "CSV を保存しました"})
