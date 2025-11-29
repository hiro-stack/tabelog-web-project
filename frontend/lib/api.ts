// 環境に応じて API の URL を切り替え
const API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL  // .env で指定されている場合
  : typeof window !== "undefined" 
    ? "http://localhost:8000"       // ブラウザ（開発中）
    : "http://backend:8000";        // サーバーサイド / Docker 内

export { API_URL };

export async function getHello() {
  const res = await fetch(`${API_URL}/api/hellow/backend/`);
  if (!res.ok) {
    throw new Error("API Error");
  }
  return res.json();
}

// GET: Item の全件取得
export async function getNames() {
  const res = await fetch(`${API_URL}/api/items/backend/`);
  if (!res.ok) {
    throw new Error("GET API Error");
  }
  return res.json(); // [{ id: 1, name: "テストA" }, { id: 2, name: "テストB" }, ...]
}

// POST: name を登録
export async function createName(name: string) {
  const res = await fetch(`${API_URL}/api/items/backend/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }), // ここで name を送る
  });
  if (!res.ok) {
    throw new Error("POST API Error");
  }
  return res.json(); // 保存されたデータが返る
}


export async function runTabelog(payload: unknown) {
  const res = await fetch(`${API_URL}/api/tabelog/run/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}