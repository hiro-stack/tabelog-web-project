"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// 型定義
interface Area {
  name: string;
}

interface Member {
  name: string;
  power: number;
  food: string;
}

export default function EnhancedSearchForm() {
  const router = useRouter();

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  // エリア
  const [areas, setAreas] = useState<Area[]>([{ name: "" }]);

  // メンバー情報
  const [members, setMembers] = useState<Member[]>([
    { name: "", power: 1, food: "" }
  ]);

  // 多数決・決定権重視 (0〜1)
  const [decisionMode, setDecisionMode] = useState<number>(0.5);

  // 重みづけ
  const [weightDistance, setWeightDistance] = useState<number>(1.0);
  const [weightBudget, setWeightBudget] = useState<number>(1.0);
  const [weightRating, setWeightRating] = useState<number>(1.0);

  // 最大許容値
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [maxTravelMinutes, setMaxTravelMinutes] = useState<number>(0);

  // 昼 or 夜
  const [mealType, setMealType] = useState<string>("dinner");

  // エリア追加
  const addArea = () => {
    setAreas([...areas, { name: "" }]);
  };

  const removeArea = (index: number) => {
    setAreas(areas.filter((_, i) => i !== index));
  };

  const updateArea = (index: number, value: string) => {
    const updated = [...areas];
    updated[index].name = value;
    setAreas(updated);
  };

  // メンバー処理
  const addMember = () => {
    setMembers([...members, { name: "", power: 1, food: "" }]);
  };

  const updateMember = (
    index: number,
    field: keyof Member,
    value: string | number
  ) => {
    const updated = [...members];
    updated[index][field] = value as never;
    setMembers(updated);
  };

  const removeMember = (index: number) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  // ---------- ⭐ SUBMIT 処理 ここ重要 ⭐ ----------
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

    console.log("📩 送信データ:", formData);

    // ⭐ ここが重要：sessionStorage に保存する
    sessionStorage.setItem("searchFormData", JSON.stringify(formData));

    // → 確認画面へ遷移
    router.push("/confirm");
    };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="card shadow rounded">
        <div className="card-body">
          <h1 className="card-title mb-4">検索フォーム</h1>

          {/* 現在地入力 */}
          <div className="mb-4">
            <label className="form-label">現在地（緯度）</label>
            <input
              type="number"
              className="form-control"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">現在地（経度）</label>
            <input
              type="number"
              className="form-control"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>

          {/* エリア入力 */}
          <div className="mb-4">
            <label className="form-label text-danger">調べたいエリア</label>
            {areas.map((area, idx) => (
              <div key={idx} className="mb-2 d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  value={area.name}
                  onChange={(e) => updateArea(idx, e.target.value)}
                  placeholder={`エリア ${idx + 1}`}
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeArea(idx)}
                >
                  削除
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={addArea}>
              ＋ エリア追加
            </button>
          </div>

          {/* メンバー */}
          <div className="mb-4">
            <label className="form-label text-danger">メンバー設定</label>
            {members.map((m, idx) => (
              <div className="border rounded p-3 mb-2" key={idx}>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="名前"
                  value={m.name}
                  onChange={(e) => updateMember(idx, "name", e.target.value)}
                />

                <input
                  type="number"
                  min="1"
                  max="5"
                  className="form-control mb-2"
                  placeholder="決定権 (1〜5)"
                  value={m.power}
                  onChange={(e) =>
                    updateMember(idx, "power", Number(e.target.value))
                  }
                />

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="食べたいもの"
                  value={m.food}
                  onChange={(e) => updateMember(idx, "food", e.target.value)}
                />

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeMember(idx)}
                >
                  削除
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addMember}>
              ＋ メンバー追加
            </button>
          </div>

          {/* 多数決 or 決定権 */}
          <div className="mb-4">
            <label className="form-label">多数決 / 決定権 重み</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              className="form-control"
              value={decisionMode}
              onChange={(e) => setDecisionMode(Number(e.target.value))}
            />
          </div>

          {/* 重みづけ */}
          <div className="mb-4">
            <label className="form-label">重みづけ</label>

            <input
              type="number"
              step="0.1"
              min="1"
              max="2"
              className="form-control mb-2"
              placeholder="距離 (1〜2)"
              value={weightDistance}
              onChange={(e) => setWeightDistance(Number(e.target.value))}
            />

            <input
              type="number"
              step="0.1"
              min="1"
              max="2"
              className="form-control mb-2"
              placeholder="価格 (1〜2)"
              value={weightBudget}
              onChange={(e) => setWeightBudget(Number(e.target.value))}
            />

            <input
              type="number"
              step="0.1"
              min="1"
              max="2"
              className="form-control"
              placeholder="評価 (1〜2)"
              value={weightRating}
              onChange={(e) => setWeightRating(Number(e.target.value))}
            />
          </div>

          {/* 最大許容 */}
          <div className="mb-4">
            <label className="form-label">最大価格</label>
            <input
              type="number"
              className="form-control mb-2"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />

            <label className="form-label mt-2">最大移動時間(分)</label>
            <input
              type="number"
              className="form-control"
              value={maxTravelMinutes}
              onChange={(e) => setMaxTravelMinutes(Number(e.target.value))}
            />
          </div>

          {/* 昼 or 夜 */}
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

          {/* ------ Submitボタン ------ */}
          <button type="submit" className="btn btn-success w-100 mt-4">
            🔍 確認画面へ進む
          </button>
        </div>
      </div>
    </form>
  );
}
