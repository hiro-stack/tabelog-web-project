from .tabelog_system.tabelog_data_collect import Tabelog_Data_Collect
from .tabelog_system.data_shaping import DataMaker
from .tabelog_system.analysts import Analysts
from .tabelog_system.generate_map import Mapping
import os
import shutil

class Application:
    def __init__(
        self,
        current_location,
        areas,
        menus,
        max_minutes,
        price_max,
        time_is,
        weight,
        votes_result,
        alpha,
    ):
        self.tabelog_data_collecter = Tabelog_Data_Collect(areas, menus)
        self.data_maked = DataMaker(current_location, votes_result, alpha)
        self.analysts = Analysts(time_is, price_max, max_minutes, weight)
        self.mapping = Mapping(current_location)

    def app(self):
        data_path = os.path.join(os.path.dirname(__file__), "tabelog_system", "data")
        if os.path.exists(data_path) and os.path.isdir(data_path):
            shutil.rmtree(data_path)  # フォルダごと削除
        self.tabelog_data_collecter.main()
        self.data_maked.main()
        self.analysts.main()
        self.mapping.main()

    def main(self):

        self.app()


if __name__ == "__main__":
    application = Application(
        current_location = {
            "name": "現在地",
            "latitude": 35.834774,
            "longitude": 139.912964
            },
        areas=["北千住", "南流山"], 
        menus=["スペイン料理", "刀削麺"],
        votes_result = {"スペイン料理": [3], "刀削麺": [5, 4, 3]},
        alpha=0.5,
        weight = {"distance": 1.1, "budget": 1.2, "evaluate": 1.3},
        max_minutes=1000,
        price_max=5000,
        time_is="lunch",
    )
    application.main()
