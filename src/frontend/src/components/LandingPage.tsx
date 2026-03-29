import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, Target, Trophy } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onEnter: () => void;
}

const STATS = [
  { icon: Brain, label: "Smart Practice", value: "Adaptive" },
  { icon: Target, label: "Questions", value: "500+" },
  { icon: Trophy, label: "Pass Rate", value: "94%" },
];

const MOTIVATIONS = [
  {
    id: "consistency",
    emoji: "🏥",
    text: "Every question you answer is a step closer to becoming the doctor you were meant to be.",
  },
  {
    id: "practice",
    emoji: "🧠",
    text: "Consistent practice beats last-minute cramming. Build your knowledge brick by brick.",
  },
  {
    id: "precision",
    emoji: "🎯",
    text: "KUHS exams reward precision. Train yourself to think clinically, not just recall facts.",
  },
];

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Background decoration */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary/30 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg"
            >
              <BookOpen className="w-10 h-10 text-primary-foreground" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase mb-2">
              KUHS
            </p>
            <h1 className="text-5xl sm:text-7xl font-bold text-foreground tracking-tight mb-4">
              MCQ <span className="text-primary">DRILL</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium mb-2">
              Master Your KUHS Exams
            </p>
            <p className="text-lg text-primary font-semibold mb-10">
              One Question at a Time.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex items-center justify-center gap-4 sm:gap-8 mb-10"
          >
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  {value}
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          >
            <Button
              data-ocid="landing.start.primary_button"
              onClick={onEnter}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
            >
              Start Drilling
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              No account needed · Start instantly
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Motivation Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        className="bg-card border-t border-border px-4 py-12"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-xs font-bold tracking-widest text-primary uppercase mb-8">
            Why Consistent Practice Matters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOTIVATIONS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + idx * 0.1, duration: 0.5 }}
                className="bg-background rounded-2xl p-5 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="text-3xl mb-3">{item.emoji}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-6 text-center text-xs text-muted-foreground">
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
