"use client";

import { useState, useEffect } from "react";
import { getHello, getNames, createName } from "@/lib/api";

export default function Home() {
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);
  const [nameInput, setNameInput] = useState("");

  // ページ表示時に Django API からメッセージ取得
  useEffect(() => {
    const fetchMessage = async () => {
      const data = await getHello();
      setMessage(data.message);
    };
    fetchMessage();
  }, []);

  // 初回表示で Item の全件取得
  useEffect(() => {
    const fetchItems = async () => {
      const data = await getNames(); // 配列で返ってくる
      setItems(data);
    };
    fetchItems();
  }, []);

  // フォーム送信で POST
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await createName(nameInput);
    alert("保存しました: " + data.name);
    setNameInput(""); // 入力リセット
    setItems((prev) => [...prev, data]); // 新しいデータをリストに追加
  };

  return (
    <main className="p-6">
      <h1>メッセージ: {message}</h1>

      <h2 className="mt-6">現在の名前一覧</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mt-6">
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="新しい名前を入力"
          className="border p-2"
        />
        <button type="submit" className="ml-3 bg-blue-500 text-white p-2">
          登録
        </button>
      </form>
    </main>
  );
}
