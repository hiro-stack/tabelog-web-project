"use client";

import { useState } from "react";
import { runTabelog } from "@/lib/api";

type FormType = {
  latitude: string;
  longitude: string;
  areas: string;
  weight_distance: string;
  weight_price: string;
  weight_evaluate: string;
  max_minutes: string;
  price_max: string;
  time_is: "lunch" | "dinner";
  participants: string;
  vote_type: "多数決" | "決定権";
  [key: string]: string; // 他の入力フィールドに対応
};

export default function Page() {
  const [form, setForm] = useState<FormType>({
    latitude: "35.834774",
    longitude: "139.912964",
    areas: "",
    weight_distance: "1.1",
    weight_price: "1.2",
    weight_evaluate: "1.3",
    max_minutes: "30",
    price_max: "3000",
    time_is: "lunch",
    participants: "",
    vote_type: "多数決",
  });

  // handleChange の型を明示
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 参加者情報を型安全に整形
    const participants: Record<string, { priority: number; menu: string }> = {};
    form.participants.split("\n").forEach((line) => {
      if (!line.trim()) return;
      const [name, priorityStr, menu] = line.split(":");
      const priority = Number(priorityStr);
      if (!name || isNaN(priority) || !menu) return;
      participants[name] = { priority, menu };
    });

    // API ペイロード作成
    const payload = {
      current_location: {
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      },
      areas: form.areas.split(",").map((s) => s.trim()),
      weight: {
        distance: Number(form.weight_distance),
        budget: Number(form.weight_price),
        evaluate: Number(form.weight_evaluate),
      },
      max_minutes: Number(form.max_minutes),
      price_max: Number(form.price_max),
      time_is: form.time_is,
      participants,
      vote_type: form.vote_type,
    };

    const res = await runTabelog(payload);
    console.log("API response:", res);
  };

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h2>最適なお店選びフォーム</h2>

      <form onSubmit={onSubmit}>
        <label>現在地（緯度）</label>
        <input name="latitude" value={form.latitude} onChange={handleChange} />

        <label>現在地（経度）</label>
        <input name="longitude" value={form.longitude} onChange={handleChange} />

        <label>検索駅（カンマ区切り）</label>
        <input name="areas" value={form.areas} onChange={handleChange} />

        <label>距離の重み</label>
        <input name="weight_distance" value={form.weight_distance} onChange={handleChange} />

        <label>価格の重み</label>
        <input name="weight_price" value={form.weight_price} onChange={handleChange} />

        <label>評価の重み</label>
        <input name="weight_evaluate" value={form.weight_evaluate} onChange={handleChange} />

        <label>最大徒歩時間（分）</label>
        <input name="max_minutes" value={form.max_minutes} onChange={handleChange} />

        <label>最大支払い価格</label>
        <input name="price_max" value={form.price_max} onChange={handleChange} />

        <label>時間帯</label>
        <select name="time_is" value={form.time_is} onChange={handleChange}>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
        </select>

        <label>参加者情報（1行ごとに `名前:優先度:食べたいもの`）</label>
        <textarea
          name="participants"
          value={form.participants}
          onChange={handleChange}
          rows={5}
        />

        <label>選択方法（多数決 or 決定権）</label>
        <select name="vote_type" value={form.vote_type} onChange={handleChange}>
          <option value="多数決">多数決</option>
          <option value="決定権">決定権</option>
        </select>

        <button type="submit" style={{ marginTop: 20 }}>
          送信
        </button>
      </form>
    </div>
  );
}
