import { BookOpen } from "lucide-react";

interface AppHeaderProps {
  activeTab: "practice" | "admin";
  onTabChange: (tab: "practice" | "admin") => void;
}

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
        {/* Logo + Wordmark */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
              KUHS
            </div>
            <div className="text-sm font-bold text-primary tracking-wide">
              MCQ DRILL
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1 ml-4">
          <button
            type="button"
            data-ocid="nav.practice.tab"
            onClick={() => onTabChange("practice")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "practice"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            Practice
          </button>
          <button
            type="button"
            data-ocid="nav.admin.tab"
            onClick={() => onTabChange("admin")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "admin"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            Admin Panel
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            K
          </div>
        </div>
      </div>
    </header>
  );
}
