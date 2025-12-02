"use client";
import { useEffect, useState } from "react";
import type { TabelogAPIResponse } from "@/lib/api";

export default function ResultPage() {
  const [data, setData] = useState<TabelogAPIResponse | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const stored = sessionStorage.getItem("tabelogResult");

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as TabelogAPIResponse;
        setData(parsed);
        console.log("📦 受け取ったデータ:", parsed);

        // HTMLをフェッチして埋め込む
        fetch(parsed.html_url)
          .then((res) => res.text())
          .then((html) => setHtmlContent(html))
          .catch((err) => console.error("❌ HTML取得エラー:", err));
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
          <h2>📄 htmlファイル</h2>
          <p>
            <a href={data.html_url} download>
              👉 htmlダウンロード
            </a>
          </p>
        </>
      )}

    
    </div>
  );
}
