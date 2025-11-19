import { getHello } from "@/lib/api";

export default async function Home() {
  const data = await getHello();

  return (
    <main>
      <h1>メッセージ: {data.message}</h1>
    </main>
  );
}