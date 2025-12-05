import React from "react";
import type { ConfirmFormData } from "@/lib/api";

export default function ConfirmSummary({ data }: { data: ConfirmFormData }) {
  const decisionModeLabel = data.decisionMode === 0 ? "多数決モード" : "決定権重視モード";
  const reverseWeight = (w: number) => Math.round((w - 1.0) / 0.1);


  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="bg-gray-100 p-4 rounded-xl space-y-6">
        <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">現在地</h2>
        <div className="text-gray-700 ml-2">
        <p>緯度: {data.latitude}</p>
        <p>経度: {data.longitude}</p>
        </div>
        </section>


        <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">エリア</h2>
        <ul className="list-disc list-inside text-gray-700 ml-2">
        {data.areas.map((a, i) => (
        <li key={i}>{a.name}</li>
        ))}
        </ul>
        </section>


        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">メンバー</h2>
            <ul className="space-y-1 text-gray-700 ml-2">
              {data.members.map((m, i) => (
                <li key={i}>
                  {m.name}（食の希望: {m.food}, 決定権の重要度: {m.power}）
                </li>
              ))}
            </ul>
        </section>


        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">意思決定モード</h2>
          <p className="text-gray-700 ml-2">{decisionModeLabel}</p>
        </section>


        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">項目の重みづけ</h2>
          <div className="grid grid-cols-2 gap-2 text-gray-700 ml-2">
            <p>距離の重要度: レベル {reverseWeight(data.weightDistance)}</p>
            <p>予算の重要度: レベル {reverseWeight(data.weightBudget)}</p>
            <p>評価の重要度: レベル {reverseWeight(data.weightRating)}</p>
          </div>
        </section>


        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">その他条件</h2>
          <div className="grid grid-cols-2 gap-2 text-gray-700 ml-2">
            <p>価格上限: ¥{data.maxPrice}</p>
            <p>最大徒歩時間: {data.maxTravelMinutes} 分</p>
            <p>食事時間帯: {data.mealType}</p>
          </div>
        </section>
      </div>
    </div>
  );
}