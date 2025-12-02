"use client";
import { useEffect, useState } from "react";
import type { TabelogAPIResponse } from "@/lib/api";


export default function ResultPage() {
  const [data, setData] = useState<TabelogAPIResponse | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("tabelogResult");

    if (stored) {
      try {
        setData(JSON.parse(stored) as TabelogAPIResponse);
      } catch (error) {
        console.error("❌ JSON parse error:", error);
      }
    }
  }, []);

  if (!data) {
    return <p style={{ padding: "20px" }}>⏳ 結果を読み込み中...</p>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1>📊 分析結果</h1>

      <pre
        style={{
          background: "#f6f6f6",
          padding: "10px",
          borderRadius: "6px",
          fontSize: "14px",
          overflow: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>

      {data.csv_url && (
        <>
          <h2>📄 CSVファイル</h2>
          <p>
            <a href={data.csv_url} download>
              👉 CSVダウンロード
            </a>
          </p>
        </>
      )}

      {data.html_url && (
        <>
          <h2>🗺 マップ結果</h2>
          <iframe
            src={data.html_url}
            style={{
              width: "100%",
              height: "450px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginTop: "10px",
            }}
          ></iframe>
        </>
      )}
    </div>
  );
}

