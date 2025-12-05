"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import AreaInputList from "@/components/searchForm/AreaInputList";
import MemberInputList from "@/components/searchForm/MemberInputList";
import DecisionModeSelector from "@/components/searchForm/DecisionModeSelector";
import WeightSelectorGroup from "@/components/searchForm/WeightSelectorGroup";

interface Area {
  name: string;
}

interface Member {
  name: string;
  power: number;
  food: string;
}

export default function SearchForm() {
  const router = useRouter();

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [areas, setAreas] = useState<Area[]>([{ name: "" }]);
  const [members, setMembers] = useState<Member[]>([{ name: "", power: 1, food: "" }]);
  const [decisionMode, setDecisionMode] = useState<number>(0.5);
  const [weightDistance, setWeightDistance] = useState<number>(1.0);
  const [weightBudget, setWeightBudget] = useState<number>(1.0);
  const [weightRating, setWeightRating] = useState<number>(1.0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [maxTravelMinutes, setMaxTravelMinutes] = useState<number>(0);
  const [mealType, setMealType] = useState<string>("dinner");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      latitude,
      longitude,
      areas,
      members,
      decisionMode,
      weightDistance,
      weightBudget,
      weightRating,
      maxPrice,
      maxTravelMinutes,
      mealType,
    };
    sessionStorage.setItem("searchFormData", JSON.stringify(formData));
    router.push("/confirm");
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="card shadow rounded">
        <div className="card-body">
          <h1 className="card-title mb-4">検索フォーム</h1>

          {/* 現在地 */}
          <div className="mb-4">
            <label className="form-label">現在地（緯度）</label>
            <input type="number" className="form-control" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="form-label">現在地（経度）</label>
            <input type="number" className="form-control" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </div>

          {/* エリア設定 */}
          <AreaInputList areas={areas} setAreas={setAreas} />

          {/* メンバー設定 */}
          <MemberInputList members={members} setMembers={setMembers} />
          

          {/* 意思決定方式 */}
          <DecisionModeSelector value={decisionMode} onChange={setDecisionMode} />


          {/* 重みづけ */}
          <WeightSelectorGroup
            weightDistance={weightDistance}
            setWeightDistance={setWeightDistance}
            weightBudget={weightBudget}
            setWeightBudget={setWeightBudget}
            weightRating={weightRating}
            setWeightRating={setWeightRating}
          />
          
          {/* 予算・移動時間 */}
          <div className="mb-4">
            <label className="form-label">最大価格（円）</label>
              <input
                type="number"
                className="form-control mb-2"
                min="1"
                placeholder="例: 3000"
                inputMode="numeric"
                value={maxPrice || ""}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />

              <label className="form-label mt-2">最大移動時間（分）</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  placeholder="例: 20"
                  inputMode="numeric"
                  value={maxTravelMinutes || ""}
                  onChange={(e) => setMaxTravelMinutes(Number(e.target.value))}
                />
          </div>

          {/* 食事時間帯 */}
          <div className="mb-4">
            <label className="form-label">昼 / 夜</label>
            <select className="form-select" value={mealType} onChange={(e) => setMealType(e.target.value)}>
              <option value="lunch">昼</option>
              <option value="dinner">夜</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100 mt-4">
            🔍 確認画面へ進む
          </button>
        </div>
      </div>
    </form>
  );
}
