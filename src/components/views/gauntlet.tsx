import { useMemo, useState } from "react";
import { Hammer } from "lucide-react";
import { Badge, Button, Card, Meter, SectionLabel } from "@/components/ui";
import { QuizEngine } from "@/components/quiz-engine";
import { TOPICS } from "@/data/facts";
import { gauntletPool, topicProgress } from "@/lib/scoring";
import { useAppStore } from "@/lib/store";

export function GauntletView() {
  const ledger = useAppStore((s) => s.ledger);
  const studiedFacts = useAppStore((s) => s.studiedFacts);
  const [run, setRun] = useState(false);
  const pool = useMemo(() => gauntletPool(ledger), [ledger]);
  const progress = topicProgress(ledger, studiedFacts);
  const weak = Object.values(ledger).filter((i) => i.status === "weak").length;
  const learning = Object.values(ledger).filter((i) => i.status === "learning").length;

  if (run) {
    return (
      <QuizEngine
        items={pool.slice(0, 24).map((q) => ({
          id: q.id,
          stem: q.stem,
          options: q.options,
          correctIndex: q.correctIndex as 0 | 1 | 2 | 3,
          rationale: q.rationale,
          reference: q.reference,
          domain: q.domain,
          faultIfWrong: q.faultIfWrong,
        }))}
        kind="gauntlet"
        label="Weak-spot gauntlet"
        instant
        onClose={() => setRun(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Weak spots</SectionLabel>
          <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide">Hammer what you miss</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Only facts tagged weak or learning after drills and one-shots. Rapid fire. Three correct answers in
            distinct sessions graduate an item to mastered. One miss resets the streak.
          </p>
        </div>
        <Button disabled={!pool.length} onClick={() => setRun(true)} className="min-h-12">
          <Hammer className="size-4" />
          {pool.length ? `Start ${Math.min(24, pool.length)}` : "Nothing weak yet"}
        </Button>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.14em] text-subtle">Weak</p>
          <p className="font-display text-4xl font-semibold tabular text-fail">{weak}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.14em] text-subtle">Learning</p>
          <p className="font-display text-4xl font-semibold tabular text-accent">{learning}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.14em] text-subtle">Queue this run</p>
          <p className="font-display text-4xl font-semibold tabular">{Math.min(24, pool.length)}</p>
        </Card>
      </div>

      <Card>
        <SectionLabel>Topic heat</SectionLabel>
        <ul className="mt-3 space-y-3">
          {TOPICS.map((t) => {
            const p = progress[t.id]!;
            return (
              <li key={t.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>
                    {t.n} {t.label}
                  </span>
                  <span className="font-mono tabular text-muted">
                    {p.weak ? `${p.weak} weak` : `${p.pct}%`}
                  </span>
                </div>
                <Meter value={p.pct} tone={p.pct >= 80 ? "pass" : p.weak ? "fail" : "accent"} />
              </li>
            );
          })}
        </ul>
      </Card>

      {!pool.length ? (
        <Card>
          <Badge tone="pass">Clear</Badge>
          <p className="mt-2 text-sm text-muted">
            Study a topic, miss a drill or a one-shot, and those facts land here. A mock you have not prepared for will
            fill this list the hard way.
          </p>
        </Card>
      ) : null}
    </div>
  );
}
