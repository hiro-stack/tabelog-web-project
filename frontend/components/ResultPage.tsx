"use client";
import { useState } from "react";
import type { TabelogAPIResponse } from "@/lib/api";
import { useRouter } from "next/navigation";


//form/confirmページでDjangoからのレスポンスをsessionStorageに格納しているので
//キーの"tabelogResult"で取り出しstoredに文字列として格納
//JSON.parseでオブジェクトに変換し、dataにセットして表示する

export default function ResultPage() {
    const router = useRouter();
    const [data] = useState<TabelogAPIResponse | null>(() => {
        const stored = sessionStorage.getItem("tabelogResult");
        return stored ? JSON.parse(stored) : null;
    });
    
    if (!data) {
      return <p style={{ padding: "20px" }}>⏳ 結果を読み込み中...</p>;
    }
    
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1 className="text-xl font-bold mb-4">📊 分析結果</h1>


      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
          <th className="border border-gray-300 px-4 py-2">店名</th>
          <th className="border border-gray-300 px-4 py-2">最終点数</th>
          <th className="border border-gray-300 px-4 py-2">ジャンル</th>
          </tr>
        </thead>
        <tbody>
          {data.records.map((r, idx) => (
          <tr key={idx} className="text-center">
          <td className="border border-gray-300 px-4 py-2">{r.name}</td>
          <td className="border border-gray-300 px-4 py-2">{Math.floor(parseFloat(r.score) * 100) / 100}</td>
          <td className="border border-gray-300 px-4 py-2">{r.category}</td>
          </tr>
          ))}
        </tbody>
      </table>


      {data.html_url && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">📄 地図</h2>
          <p>
            <a href={data.html_url} download className="text-blue-600 underline">
            👉 地図で表示
            </a>
          </p>
        </div>
      )}


      <button
        className="mt-6 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
        onClick={() => router.push("/searchForm")}
      >
      ⬅ 検索画面に戻る
      </button>
      
      </div>
      
    );
}