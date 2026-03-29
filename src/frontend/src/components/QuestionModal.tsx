import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Question } from "../backend.d";

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    questionText: string;
    answerOptions: string[];
    correctAnswerIndex: bigint;
    explanation: string;
    category: string;
  }) => void;
  isPending: boolean;
  initial?: Question | null;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export function QuestionModal({
  open,
  onClose,
  onSave,
  isPending,
  initial,
}: QuestionModalProps) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<string>("0");
  const [explanation, setExplanation] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setQuestionText(initial.questionText);
      setOptions(
        initial.answerOptions
          .slice(0, 4)
          .concat(
            Array(Math.max(0, 4 - initial.answerOptions.length)).fill(""),
          ),
      );
      setCorrectIndex(String(Number(initial.correctAnswerIndex)));
      setExplanation(initial.explanation);
      setCategory(initial.category);
    } else {
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectIndex("0");
      setExplanation("");
      setCategory("");
    }
  }, [open, initial]);

  function handleOptionChange(i: number, val: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)));
  }

  function handleSubmit() {
    if (!questionText.trim() || options.some((o) => !o.trim())) return;
    onSave({
      questionText: questionText.trim(),
      answerOptions: options.map((o) => o.trim()),
      correctAnswerIndex: BigInt(correctIndex),
      explanation: explanation.trim(),
      category: category.trim(),
    });
  }

  const isValid =
    questionText.trim() !== "" && options.every((o) => o.trim() !== "");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-xl max-h-[90vh] overflow-y-auto"
        data-ocid="question.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {initial ? "Edit Question" : "Add New Question"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q-text" className="font-semibold">
              Question
            </Label>
            <Textarea
              id="q-text"
              data-ocid="question.textarea"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter the question…"
              rows={3}
              className="resize-none"
            />
          </div>

          {OPTION_LABELS.map((label, i) => (
            <div key={label} className="flex flex-col gap-2">
              <Label htmlFor={`opt-${label}`} className="font-semibold">
                Option {label}
              </Label>
              <Input
                id={`opt-${label}`}
                data-ocid={`question.option_${label.toLowerCase()}.input`}
                value={options[i]}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                placeholder={`Option ${label}`}
              />
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <Label className="font-semibold">Correct Answer</Label>
            <Select value={correctIndex} onValueChange={setCorrectIndex}>
              <SelectTrigger data-ocid="question.correct_answer.select">
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                {OPTION_LABELS.map((l, i) => (
                  <SelectItem key={l} value={String(i)}>
                    Option {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="q-category" className="font-semibold">
              Category
            </Label>
            <Input
              id="q-category"
              data-ocid="question.category.input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Anatomy, Physiology…"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="q-explanation" className="font-semibold">
              Explanation
            </Label>
            <Textarea
              id="q-explanation"
              data-ocid="question.explanation.textarea"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain the correct answer…"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            data-ocid="question.cancel.button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            data-ocid="question.save.button"
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving…" : "Save Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
