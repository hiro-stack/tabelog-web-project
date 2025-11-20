
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://backend:8000";

export async function getHello() {
  const res = await fetch(`${API_URL}/api/hellow/backend/`);
  if (!res.ok) {
    throw new Error("API Error");
  }
  return res.json();
}