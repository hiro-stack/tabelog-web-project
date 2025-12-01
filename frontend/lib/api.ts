// 環境に応じて API の URL を切り替え
const API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL  // .env で指定されている場合
  : typeof window !== "undefined" 
    ? "http://localhost:8000"       // ブラウザ（開発中）
    : "http://backend:8000";        // サーバーサイド / Docker 内

export { API_URL };


export interface ConfirmFormData {
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


export async function runTabelog(formData: ConfirmFormData) {
  const payload = formatToApplicationPayload(formData);

  const res = await fetch(`${API_URL}/api/tabelog/run/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("API error");
  return res.json();
}


// --- Applicationに送る形式へ変換 ---
function formatToApplicationPayload(formData: ConfirmFormData) {
  // votes_result作成（方式③）
  const votes_result: Record<string, number[]> = {};

  formData.members.forEach((member: { food: string; power: number }) => {
    if (!member.food) return; // 食べたいものが空なら無視
  
    if (!votes_result[member.food]) {
      votes_result[member.food] = [];
    }

    votes_result[member.food].push(member.power);
  });

  return {
    current_location: {
      name: "現在地",
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    },
    areas: formData.areas.map((a: { name: string }) => a.name),
    menus: [...new Set(formData.members.map((m: { food: string }) => m.food))], // 重複削除
    votes_result,
    alpha: formData.decisionMode,
    weight: {
      distance: formData.weightDistance,
      budget: formData.weightBudget,
      evaluate: formData.weightRating,
    },
    max_minutes: formData.maxTravelMinutes,
    price_max: formData.maxPrice,
    time_is: formData.mealType,
  };
}
