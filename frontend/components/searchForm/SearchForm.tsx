"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import AreaInputList from "@/components/searchForm/AreaInputList";
import MemberInputList from "@/components/searchForm/MemberInputList";
import DecisionModeSelector from "@/components/searchForm/DecisionModeSelector";
import WeightSelectorGroup from "@/components/searchForm/WeightSelectorGroup";
import LocationInput from "@/components/searchForm/LocationInput";

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

  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [areas, setAreas] = useState<Area[]>([{ name: "" }]);
  const [members, setMembers] = useState<Member[]>([{ name: "", power: 1, food: "" }]);
  const [decisionMode, setDecisionMode] = useState<number>(0);
  const [weightDistance, setWeightDistance] = useState<number>(1.0);
  const [weightBudget, setWeightBudget] = useState<number>(1.0);
  const [weightRating, setWeightRating] = useState<number>(1.0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [maxTravelMinutes, setMaxTravelMinutes] = useState<number>(0);
  const [mealType, setMealType] = useState<string>("dinner");

  const [formErrors, setFormErrors] = useState<string[]>([]);


  
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      errors.push("緯度は -90〜90 の範囲で入力してください。");
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      errors.push("経度は -180〜180 の範囲で入力してください。");
    }

    areas.forEach((a, i) => {
      if (!a.name.trim()) {
        errors.push(`エリア ${i + 1} が未入力です。`);
      }
    });

    members.forEach((m, i) => {
      if (!m.name.trim()) {
        errors.push(`メンバー ${i + 1} の名前が未入力です。`);
      }
      if (!m.food.trim()) {
        errors.push(`メンバー ${i + 1} の食べたいものが未入力です。`);
      }
    });

    const isValidWeight = (w: number) => w >= 1.1 && w <= 2.0;
    if (!isValidWeight(weightDistance)) errors.push("距離の重みが未選択です。");
    if (!isValidWeight(weightBudget)) errors.push("価格の重みが未選択です。");
    if (!isValidWeight(weightRating)) errors.push("評価の重みが未選択です。");

    if (maxPrice <= 0) errors.push("最大価格は 1 円以上で入力してください。");
    if (maxTravelMinutes <= 0) errors.push("最大移動時間は 1 分以上で入力してください。");

    return errors;
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    router.push("/confirm");
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="card shadow rounded">
        <div className="card-body">
          <h1 className="card-title mb-4">検索フォーム</h1>

          {formErrors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {formErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <LocationInput
            latitude={latitude}
            longitude={longitude}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />

          <AreaInputList areas={areas} setAreas={setAreas} />
          <MemberInputList members={members} setMembers={setMembers} />
          <DecisionModeSelector value={decisionMode} onChange={setDecisionMode} />

          <WeightSelectorGroup
            weightDistance={weightDistance}
            setWeightDistance={setWeightDistance}
            weightBudget={weightBudget}
            setWeightBudget={setWeightBudget}
            weightRating={weightRating}
            setWeightRating={setWeightRating}
          />

          <div className="mb-4">
            <label className="form-label">最大価格（円）</label>
            <input
              type="number"
              className="form-control mb-2"
              min="1"
              value={maxPrice || ""}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />

            <label className="form-label mt-2">最大移動時間（分）</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={maxTravelMinutes || ""}
              onChange={(e) => setMaxTravelMinutes(Number(e.target.value))}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">昼 / 夜</label>
            <select
              className="form-select"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
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
