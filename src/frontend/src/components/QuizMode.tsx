import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Question } from "../backend.d";
import {
  useGetAllQuestions,
  useInitializeQuestions,
} from "../hooks/useQueries";

const OPTION_LABELS = ["A", "B", "C", "D"];

interface AnswerState {
  selectedIndex: number;
  isCorrect: boolean;
}

export function QuizMode() {
  const { data: questions, isLoading } = useGetAllQuestions();
  const initMutation = useInitializeQuestions();
  const initialized = useRef(false);
  const [selectedModule, setSelectedModule] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [quizDone, setQuizDone] = useState(false);

  const { mutate: initMutate } = initMutation;

  useEffect(() => {
    if (
      !isLoading &&
      questions &&
      questions.length === 0 &&
      !initialized.current
    ) {
      initialized.current = true;
      initMutate();
    }
  }, [isLoading, questions, initMutate]);

  // Reverse so newest questions appear first
  const allQuestions: Question[] = useMemo(
    () => (questions ?? []).slice().reverse(),
    [questions],
  );

  // Derive unique categories
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(allQuestions.map((q) => q.category).filter(Boolean)),
    );
    return ["All", ...cats];
  }, [allQuestions]);

  // Filter questions by module
  const moduleQuestions = useMemo(() => {
    if (selectedModule === "All") return allQuestions;
    return allQuestions.filter((q) => q.category === selectedModule);
  }, [allQuestions, selectedModule]);

  function handleModuleChange(module: string) {
    setSelectedModule(module);
    setCurrentIndex(0);
    setAnswers({});
    setQuizDone(false);
  }

  const totalQuestions = moduleQuestions.length;
  const currentQuestion = moduleQuestions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const progressPercent =
    totalQuestions > 0 ? Math.round((currentIndex / totalQuestions) * 100) : 0;
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;

  function handleSelectOption(optionIndex: number) {
    if (currentAnswer !== undefined) return;
    const isCorrect =
      BigInt(optionIndex) === currentQuestion.correctAnswerIndex;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: { selectedIndex: optionIndex, isCorrect },
    }));
  }

  function handleNext() {
    if (currentIndex + 1 >= totalQuestions) {
      setQuizDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setAnswers({});
    setQuizDone(false);
  }

  if (isLoading || initMutation.isPending) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[400px] gap-4"
        data-ocid="quiz.loading_state"
      >
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground">Loading questions…</p>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[400px] gap-4"
        data-ocid="quiz.empty_state"
      >
        <BookOpen className="w-16 h-16 text-primary/40" />
        <p className="text-muted-foreground text-lg">No questions available.</p>
        <p className="text-sm text-muted-foreground">
          Add questions in the Admin Panel.
        </p>
      </div>
    );
  }

  if (quizDone) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Module tabs — keep visible on results too */}
        {categories.length > 1 && (
          <ModuleTabs
            categories={categories}
            selected={selectedModule}
            onSelect={handleModuleChange}
          />
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4"
          data-ocid="quiz.success_state"
        >
          <div className="bg-card rounded-2xl shadow-card p-8 text-center">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Quiz Complete!
            </h2>
            <p className="text-muted-foreground mb-6">You scored</p>
            <div className="text-5xl font-bold text-primary mb-2">
              {correctCount}
              <span className="text-2xl text-muted-foreground">
                /{totalQuestions}
              </span>
            </div>
            <p className="text-muted-foreground mb-8">
              {Math.round((correctCount / totalQuestions) * 100)}% correct
            </p>
            <Button
              data-ocid="quiz.restart.button"
              onClick={handleRestart}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Module tabs */}
      {categories.length > 1 && (
        <ModuleTabs
          categories={categories}
          selected={selectedModule}
          onSelect={handleModuleChange}
        />
      )}

      {totalQuestions === 0 ? (
        <div
          className="flex flex-col items-center justify-center min-h-[300px] gap-4 mt-8"
          data-ocid="quiz.empty_state"
        >
          <BookOpen className="w-12 h-12 text-primary/40" />
          <p className="text-muted-foreground">No questions in this module.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span>{progressPercent}% complete</span>
            </div>
            <Progress
              value={progressPercent}
              className="h-2 bg-secondary [&>[data-state]]:bg-primary"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedModule}-${currentIndex}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {currentQuestion.category && (
                <div className="inline-block bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {currentQuestion.category}
                </div>
              )}

              <div className="bg-card rounded-2xl shadow-card p-6 mb-4">
                <h2 className="text-lg font-semibold text-foreground leading-relaxed">
                  {currentQuestion.questionText}
                </h2>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                {currentQuestion.answerOptions.map((option, i) => {
                  const isSelected = currentAnswer?.selectedIndex === i;
                  const correctIdx = Number(currentQuestion.correctAnswerIndex);
                  const isCorrectOption = i === correctIdx;
                  const answered = currentAnswer !== undefined;

                  let optionClass =
                    "bg-card border-2 border-border text-foreground hover:bg-accent hover:border-primary/40";
                  if (answered) {
                    if (isCorrectOption) {
                      optionClass =
                        "bg-correct-bg border-2 border-correct-fg text-correct-fg";
                    } else if (isSelected && !currentAnswer.isCorrect) {
                      optionClass =
                        "bg-wrong-bg border-2 border-wrong-fg text-wrong-fg";
                    } else {
                      optionClass =
                        "bg-card border-2 border-border text-muted-foreground opacity-60";
                    }
                  }

                  return (
                    <button
                      type="button"
                      key={OPTION_LABELS[i]}
                      data-ocid={`quiz.option.${i + 1}`}
                      onClick={() => handleSelectOption(i)}
                      disabled={answered}
                      className={`w-full text-left rounded-xl p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer disabled:cursor-default ${optionClass}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          answered && isCorrectOption
                            ? "bg-correct-fg text-white"
                            : answered && isSelected && !currentAnswer.isCorrect
                              ? "bg-wrong-fg text-white"
                              : "bg-primary/10 text-primary"
                        }`}
                      >
                        {OPTION_LABELS[i]}
                      </span>
                      <span className="text-sm font-medium">{option}</span>
                      {answered && isCorrectOption && (
                        <CheckCircle2 className="ml-auto w-5 h-5 text-correct-fg" />
                      )}
                      {answered && isSelected && !currentAnswer.isCorrect && (
                        <XCircle className="ml-auto w-5 h-5 text-wrong-fg" />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {currentAnswer !== undefined && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-explanation-bg border border-explanation-border rounded-xl p-5 mb-4"
                    data-ocid="quiz.explanation.panel"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-correct-fg">
                        📖 Explanation
                      </span>
                      {currentAnswer.isCorrect ? (
                        <span className="text-xs font-semibold text-correct-fg bg-correct-bg px-2 py-0.5 rounded-full">
                          Correct!
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-wrong-fg bg-wrong-bg px-2 py-0.5 rounded-full">
                          Incorrect
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {currentAnswer !== undefined && (
                <Button
                  data-ocid="quiz.next.button"
                  onClick={handleNext}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 font-semibold"
                >
                  {currentIndex + 1 >= totalQuestions
                    ? "See Results"
                    : "Next Question →"}
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function ModuleTabs({
  categories,
  selected,
  onSelect,
}: {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <div className="mb-2" data-ocid="quiz.module.tab">
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              selected === cat
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
