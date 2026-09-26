import { Badge } from "@/components/ui";
import { TOPICS } from "@/data/facts";
import type { Fact } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TeachPanel({ fact, compact = false }: { fact: Fact; compact?: boolean }) {
  const topic = TOPICS.find((t) => t.id === fact.topic);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {topic ? (
          <Badge tone="accent">
            {topic.n} {topic.label}
          </Badge>
        ) : null}
        <Badge>{fact.reference}</Badge>
      </div>
      <h2 className="font-display text-2xl font-semibold uppercase tracking-wide sm:text-3xl">{fact.title}</h2>
      <p className="text-sm leading-relaxed text-fg sm:text-base">{fact.teach}</p>
      {compact ? null : (
        <div className="rounded-[var(--radius-md)] bg-bg p-3">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-warn">Common trap</p>
          <p className="mt-1 text-sm text-muted">{fact.trap}</p>
        </div>
      )}
    </div>
  );
}

export function ChoiceGrid({
  options,
  correctIndex,
  chosen,
  revealed,
  onChoose,
}: {
  options: readonly string[];
  correctIndex: number;
  chosen: number | null;
  revealed: boolean;
  onChoose: (i: number) => void;
}) {
  const letters = ["A", "B", "C", "D"] as const;
  return (
    <div className="grid gap-2">
      {options.map((opt, i) => {
        const isChosen = chosen === i;
        const isCorrect = i === correctIndex;
        return (
          <button
            key={`${i}-${opt}`}
            type="button"
            onClick={() => onChoose(i)}
            disabled={revealed}
            className={cn(
              "min-h-12 rounded-[var(--radius-md)] px-3 py-3 text-left text-sm shadow-[var(--shadow-border)] transition-[background-color,box-shadow,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
              "hover:bg-surface-2 disabled:cursor-default",
              !revealed && isChosen && "bg-surface-2",
              revealed && isCorrect && "bg-pass/15 text-fg shadow-[0_0_0_1px_rgba(52,211,153,0.45)]",
              revealed && isChosen && !isCorrect && "bg-fail/15 shadow-[0_0_0_1px_rgba(251,113,133,0.45)]",
            )}
          >
            <span className="mr-2 font-mono text-xs text-subtle">{letters[i] ?? i + 1} </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function VerdictNote({
  ok,
  fact,
}: {
  ok: boolean;
  fact: Fact;
}) {
  return (
    <div className="rounded-[var(--radius-md)] bg-bg p-3 text-sm">
      <p className={cn("font-medium", ok ? "text-pass" : "text-fail")}>
        {ok ? "Correct" : "Incorrect"} · {fact.reference}
      </p>
      <p className="mt-1 text-muted">{fact.rationale}</p>
      {ok ? null : <p className="mt-2 text-fg">{fact.teach}</p>}
    </div>
  );
}
