import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  EyeOff,
  LayoutGrid,
  Lock,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Question } from "../backend.d";
import {
  useCreateQuestion,
  useDeleteQuestion,
  useGetAllQuestions,
  useUpdateQuestion,
} from "../hooks/useQueries";
import { QuestionModal } from "./QuestionModal";

const OPTION_LABELS = ["A", "B", "C", "D"];
const ADMIN_PASSWORD = "Tesla786";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  if (!authenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-16"
        data-ocid="admin.auth.panel"
      >
        <div className="bg-card rounded-2xl shadow-card p-10 text-center border border-border">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Admin Panel
          </h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Enter password to continue.
          </p>
          <form onSubmit={handleSubmit} className="text-left space-y-4">
            <div className="relative">
              <Input
                data-ocid="admin.password.input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Password"
                className="pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                data-ocid="admin.password.toggle"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {error && (
              <p
                data-ocid="admin.password.error_state"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}
            <Button
              data-ocid="admin.login.button"
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-6 text-base font-semibold rounded-xl"
            >
              Login
            </Button>
          </form>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}

export function AdminPanel() {
  const { data: questions, isLoading } = useGetAllQuestions();
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);

  const filtered = (questions ?? []).filter(
    (q) =>
      q.questionText.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditingQuestion(null);
    setModalOpen(true);
  }

  function openEdit(q: Question) {
    setEditingQuestion(q);
    setModalOpen(true);
  }

  async function handleSave(data: {
    questionText: string;
    answerOptions: string[];
    correctAnswerIndex: bigint;
    explanation: string;
    category: string;
  }) {
    if (editingQuestion) {
      await updateMutation.mutateAsync({
        ...editingQuestion,
        ...data,
      });
      toast.success("Question updated");
    } else {
      await createMutation.mutateAsync(data);
      toast.success("Question added");
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.questionId);
    toast.success("Question deleted");
    setDeleteTarget(null);
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminAuthGuard>
      <div className="max-w-5xl mx-auto">
        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Admin Panel
            </p>
            <h1 className="text-2xl font-bold text-foreground">
              Question Bank
            </h1>
          </div>
          <Button
            data-ocid="admin.add_question.button"
            onClick={openAdd}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Question
          </Button>
        </div>

        {/* Search card */}
        <div className="bg-card rounded-2xl shadow-card p-4 sm:p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="admin.search.input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions or categories…"
              className="pl-9"
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-3" data-ocid="admin.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="admin.empty_state"
            >
              <LayoutGrid className="w-12 h-12 text-primary/30" />
              <p className="text-muted-foreground">No questions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.questions.table">
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="w-12 text-xs">#</TableHead>
                    <TableHead className="text-xs">Question</TableHead>
                    <TableHead className="text-xs w-32">Category</TableHead>
                    <TableHead className="text-xs w-28">Answer</TableHead>
                    <TableHead className="text-xs w-24 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((q, idx) => (
                    <motion.tr
                      key={String(q.questionId)}
                      data-ocid={`admin.questions.item.${idx + 1}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="border-border hover:bg-accent/40 transition-colors"
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground line-clamp-2 max-w-sm">
                          {q.questionText}
                        </p>
                      </TableCell>
                      <TableCell>
                        {q.category ? (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-secondary text-secondary-foreground"
                          >
                            {q.category}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Option{" "}
                          {OPTION_LABELS[Number(q.correctAnswerIndex)] ?? "?"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            data-ocid={`admin.questions.edit_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(q)}
                            className="h-8 w-8 p-0 hover:bg-accent hover:text-primary"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            data-ocid={`admin.questions.delete_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(q)}
                            className="h-8 w-8 p-0 hover:bg-wrong-bg hover:text-wrong-fg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Modal */}
        <QuestionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          isPending={isSaving}
          initial={editingQuestion}
        />

        {/* Delete confirmation */}
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(v) => !v && setDeleteTarget(null)}
        >
          <AlertDialogContent data-ocid="admin.delete.dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Question?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the question. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="admin.delete.cancel_button">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                data-ocid="admin.delete.confirm_button"
                onClick={handleDelete}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminAuthGuard>
  );
}
