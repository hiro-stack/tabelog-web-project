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

    def get(self, request):
        """GET → そのまま固定パラメータで実行"""
        return self.run_tabelog(
            current_location={
                "name": "現在地",
                "latitude": 35.834774,
                "longitude": 139.912964,
            },
            areas=["北千住", "南流山"],
            menus=["スペイン料理", "刀削麺"],
            votes_result={"スペイン料理": [3], "刀削麺": [5, 4, 3]},
            alpha=0.5,
            weight={"distance": 1.1, "budget": 1.2, "evaluate": 1.3},
            max_minutes=1000,
            price_max=5000,
            time_is="lunch",
        )

    def post(self, request):
        """POST → パラメータを JSON で受け取って実行"""
        import json

        body = json.loads(request.body)

        return self.run_tabelog(
            current_location=body.get("current_location"),
            areas=body.get("areas"),
            menus=body.get("menus"),
            votes_result=body.get("votes_result"),
            alpha=body.get("alpha"),
            weight=body.get("weight"),
            max_minutes=body.get("max_minutes"),
            price_max=body.get("price_max"),
            time_is=body.get("time_is"),
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
