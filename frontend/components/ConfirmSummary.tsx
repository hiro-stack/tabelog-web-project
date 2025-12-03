import React from "react";
import type { ConfirmFormData } from "@/lib/api";

export default function ConfirmSummary({ data }: { data: ConfirmFormData }) {
  return (
    <div className="bg-light p-3 rounded">
      <h2 className="mb-2">現在地</h2>
      <p>緯度: {data.latitude}</p>
      <p>経度: {data.longitude}</p>

      <h2 className="mt-3">エリア</h2>
      <ul>
        {data.areas.map((a, i) => (
          <li key={i}>{a.name}</li>
        ))}
      </ul>

      <h2 className="mt-3">メンバー</h2>
      <ul>
        {data.members.map((m, i) => (
          <li key={i}>
            {m.name}（食の希望: {m.food}, 決定権の重要度: {m.power}）
          </li>
        ))}
      </ul>

      <h2 className="mt-3">意思決定モード</h2>
        <p>多数決に基づいて決定か0より、決定権に基づいて決定か1より: {data.decisionMode}
        </p>

      <h2 className="mt-3">項目の重みづけ</h2>
      <p>距離: {data.weightDistance}</p>
      <p>予算: {data.weightBudget}</p>
      <p>評価: {data.weightRating}</p>

      <h2 className="mt-3">その他条件</h2>
      <p>価格上限: ¥{data.maxPrice}</p>
      <p>最大徒歩時間: {data.maxTravelMinutes}分</p>
      <p>食事時間帯 dinner or lunch: {data.mealType}</p>
    </div>
  );
}
