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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
    <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">送信内容の確認</h1>
    
    <ConfirmSummary data={data} />


    <div className="flex justify-between mt-8">
      <button
        className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800"
        onClick={() => router.push("/")}
        >
        ⬅ 入力画面に戻る
      </button>

      <button
        className="relative px-6 py-2 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50"
        onClick={handleSubmitToServer}
        disabled={loading}
        >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            送信中...
          </span>
          ) : (
            "計算を開始する"
          )
        }
      </button>
    </div>
  </div>
  </div>
  );
}
