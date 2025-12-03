// 環境に応じて API の URL を切り替え
const API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL  //← .env で指定されている場合(今回は未使用)
  : typeof window !== "undefined" 
    ? "http://localhost:8000"       // ブラウザ（開発中）
    : "http://backend:8000";        // サーバーサイド / Docker 内

export { API_URL };


// Django から返される結果データの各レコードの型
export interface TabelogRecord {
  name: string;
  score: string;
  star_rating: string;
  price: string;
  category: string;
  walk_time: string;
  latitude: string;
  longitude: string;
}

// Django からResponseとして返されるデータの型
export interface TabelogAPIResponse {
  message: string;
  records: TabelogRecord[];
  csv_url: string;
  html_url: string;
}

//ユーザーが入力したデータの型
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

/*
// ***　↓　動作確認用API　↓　*** 
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
  return res.json();
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

//***　↑　ここまで動作確認用のAPI処理　↑ 　***
*/



// ---POST: Django の tabelog/run/ API を呼び出す関数---
// データの送信と、レスポンスの受け取りを行う
export async function runTabelog(formData: ConfirmFormData) {
  const payload = formatToApplicationPayload(formData);

  const res = await fetch(`${API_URL}/api/tabelog/run/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("API error");
  return res.json() as Promise<TabelogAPIResponse>;
}


// --- ユーザーが入力した値から実際にDjangoに送るデータに加工する処理 ---
function formatToApplicationPayload(formData: ConfirmFormData) {
  const votes_result: Record<string, number[]> = {};

  formData.members.forEach((member: { food: string; power: number }) => {
    if (!member.food) return;
  
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
    menus: [...new Set(formData.members.map((m: { food: string }) => m.food))],
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
