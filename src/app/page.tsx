import { QrCodeReader } from "./components";

export default function Home() {
  return (
    <main className="w-screen flex min-h-screen flex-col items-center justify-between p-4">
      <QrCodeReader />
    </main>
  );
}
