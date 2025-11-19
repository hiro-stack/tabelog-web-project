// frontend/app/layout.tsx
export const metadata = {
  title: "Tabelog Clone",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
