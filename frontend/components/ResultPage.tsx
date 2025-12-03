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
      <h1>📊 分析結果</h1>

      <table className="table">
        <thead>
            <tr>
            <th>店名</th>
            <th>点数</th>
            <th>星5段階評価</th>
            <th>価格</th>
            <th>カテゴリ</th>
            <th>徒歩(分)</th>
            </tr>
        </thead>
        <tbody>
            {data.records.map((r, idx) => (
            <tr key={idx}>
                <td>{r.name}</td>
                <td>{r.score}</td>
                <td>{r.star_rating}</td>
                <td>{r.price}</td>
                <td>{r.category}</td>
                <td>{r.walk_time}</td>
            </tr>
            ))}
        </tbody>
      </table>
      {data.html_url && (
        <>
          <h2>📄 htmlファイル</h2>
          <p>
            <a href={data.html_url} download>
              👉 htmlダウンロード
            </a>
          </p>
        </>
      )}
    <button
        className="btn btn-secondary mt-4"
        onClick={() => router.push("/form")}
      >
        ⬅ 検索画面に戻る
    </button>
    </div>
  );
}