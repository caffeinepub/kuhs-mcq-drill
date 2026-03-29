import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AdminPanel } from "./components/AdminPanel";
import { AppHeader } from "./components/AppHeader";
import { QuizMode } from "./components/QuizMode";

type Tab = "practice" | "admin";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("practice");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster richColors position="top-right" />
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 px-4 sm:px-6 py-8">
        {activeTab === "practice" ? <QuizMode /> : <AdminPanel />}
      </main>

      <footer className="border-t border-border bg-card py-4 px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
