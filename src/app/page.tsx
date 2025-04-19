import Calculator from "@/components/Calculator";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      <Calculator />
    </main>
  );
}