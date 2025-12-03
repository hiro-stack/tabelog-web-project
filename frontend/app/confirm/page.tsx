"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { runTabelog } from "@/lib/api";
import type { ConfirmFormData } from "@/lib/api";
import ConfirmSummary from "@/components/ConfirmSummary";


export default function ConfirmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //前のページここでいうと/formからsessionStorage経由でデータを取得
  const [data] = useState<ConfirmFormData | null>(() => {
    const stored = sessionStorage.getItem("searchFormData");
    return stored ? (JSON.parse(stored) as ConfirmFormData) : null;
  });

  if (!data) return <p>データ取得中...</p>;


  //Djangoにデータを送信する、レスポンスを"tabelogResult(sessionStorageのキー)"に格納する関数
  //送信成功後、/resultページに遷移する
  const handleSubmitToServer = async () => {
    setLoading(true);

    try {
      const result = await runTabelog(data);
      console.log("Django Response:", result);
      sessionStorage.setItem("tabelogResult", JSON.stringify(result));

      alert("送信成功しました！");
      router.push("/result");
    } catch (error) {
      console.error("Error:", error);
      alert("送信に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-3">送信内容確認</h1>

      <ConfirmSummary data={data} />

      <div className="d-flex gap-3 mt-4">
        <button className="btn btn-secondary" onClick={() => router.push("/")}>
          ⬅ 入力画面に戻る
        </button>

        <button
          className="btn btn-success"
          onClick={handleSubmitToServer}
          disabled={loading}
        >
          {loading ? "送信中..." : "計算を開始する"}
        </button>
      </div>
    </div>
  );
}
