import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, LogOut } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AppHeaderProps {
  activeTab: "practice" | "admin";
  onTabChange: (tab: "practice" | "admin") => void;
}

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const shortPrincipal = identity
    ? identity.getPrincipal().toString().slice(0, 5)
    : null;

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
          {isLoggedIn && (
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
          )}
        </nav>

        {/* Right side: auth */}
        <div className="ml-auto flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {shortPrincipal?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="text-xs font-mono text-foreground">
                  {shortPrincipal}…
                </span>
              </div>
              <Button
                data-ocid="header.logout.button"
                variant="ghost"
                size="sm"
                onClick={clear}
                className="text-muted-foreground hover:text-foreground gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button
              data-ocid="header.login.button"
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? "Connecting…" : "Login"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
