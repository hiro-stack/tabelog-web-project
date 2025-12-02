"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { runTabelog } from "@/lib/api";

interface ConfirmFormData {
  latitude: number;
  longitude: number;
  areas: { name: string }[];
  members: { name: string; power: number; food: string }[];
  decisionMode: number;
  weightDistance: number;
  weightBudget: number;
  weightRating: number;
  maxPrice: number;
  maxTravelMinutes: number;
  mealType: string;
}

export default function ConfirmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ⭐ sessionStorageから初期ロード
  const [data] = useState<ConfirmFormData | null>(() => {
    const stored = sessionStorage.getItem("searchFormData");
    return stored ? (JSON.parse(stored) as ConfirmFormData) : null;
  });

  if (!data) return <p>データ取得中...</p>;

  // 🚀 Djangoへ送信する関数
  const handleSubmitToServer = async () => {
    setLoading(true);

    try {
      const result = await runTabelog(data);
      console.log("🟢 Django Response:", result);

      // ⬇⬇⬇ ★ 結果を保存 ★ ⬇⬇⬇
      sessionStorage.setItem("tabelogResult", JSON.stringify(result));

      alert("🎉 送信成功しました！");
      router.push("/result"); // ← 結果ページへ
    } catch (error) {
      console.error("❌ Error:", error);
      alert("送信に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-3">送信内容確認</h1>

      <pre className="bg-light p-3 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>

      <div className="d-flex gap-3 mt-4">
        <button className="btn btn-secondary" onClick={() => router.push("/")}>
          ⬅ 入力画面に戻る
        </button>

        <button
          className="btn btn-success"
          onClick={handleSubmitToServer}
          disabled={loading}
        >
          {loading ? "送信中..." : "🚀 Djangoへ送信"}
        </button>
      </div>
    </div>
  );
}
