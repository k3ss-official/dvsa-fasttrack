import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Target,
  Zap,
} from "lucide-react";
import { ChoiceGrid, TeachPanel, VerdictNote } from "@/components/teach-panel";
import { Badge, Button, Card, Meter, SectionLabel } from "@/components/ui";
import { FACTS, TOPICS, factsForTopic } from "@/data/facts";
import { haptic } from "@/lib/audio";
import { readinessPercent, shuffleChoices, topicProgress } from "@/lib/scoring";
import { useAppStore } from "@/lib/store";
import type { Fact, TabId, TopicId } from "@/lib/types";
import { cn, daysUntil } from "@/lib/utils";

export function PipelineView({ go }: { go: (tab: TabId) => void }) {
  const [topic, setTopic] = useState<TopicId | null>(null);
  if (topic) {
    return (
      <TopicStudy
        key={topic}
        topic={topic}
        onBack={() => setTopic(null)}
        onOpenNext={setTopic}
        go={go}
      />
    );
  }
  return <LearnHome go={go} onOpen={setTopic} />;
}

function LearnHome({
  go,
  onOpen,
}: {
  go: (tab: TabId) => void;
  onOpen: (id: TopicId) => void;
}) {
  const ledger = useAppStore((s) => s.ledger);
  const studiedFacts = useAppStore((s) => s.studiedFacts);
  const theoryPassed = useAppStore((s) => s.theoryPassed);
  const hazardBest = useAppStore((s) => s.hazardBest);
  const testDate = useAppStore((s) => s.testDate);

  const progress = topicProgress(ledger, studiedFacts);
  const studiedN = Object.keys(studiedFacts).length;
  const ready = readinessPercent({ ledger, studiedFacts, theoryPassed, hazardBest });
  const days = daysUntil(testDate || null);
  const weak = FACTS.filter((f) => ledger[f.id]?.status === "weak").length;
  const next = FACTS.find((f) => !studiedFacts[f.id]) ?? FACTS.find((f) => ledger[f.id]?.status === "weak");
  const nextTopic = next ? TOPICS.find((t) => t.id === next.topic) : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <SectionLabel>2026 motorcycle theory</SectionLabel>
          <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide sm:text-5xl">
            Learn the facts first
          </h1>
          <p className="mt-2 text-sm text-muted">
            Official 14 categories. Teach, then drill, then a one-shot question, then a timed mock. The paper is 50
            questions in 57 minutes, pass 43, plus hazard clips 44/75 — same sitting, certificate two years.
          </p>
        </div>
        <div className="min-w-36 rounded-[var(--radius-lg)] bg-surface p-4 text-right shadow-[var(--shadow-border)]">
          <p className="font-display text-[11px] uppercase tracking-[0.16em] text-subtle">Readiness</p>
          <p className="font-display text-4xl font-semibold tabular">{ready}%</p>
          {days !== null ? (
            <p className="text-xs text-muted">{days >= 0 ? `${days} days to test` : `${Math.abs(days)} days ago`}</p>
          ) : (
            <p className="text-xs text-muted">Set a date in Settings</p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Studied" value={`${studiedN}/${FACTS.length}`} />
        <Stat label="Weak" value={String(weak)} tone={weak ? "fail" : "pass"} />
        <Stat label="Pass mark" value="43/50" />
        <Stat label="Hazard" value="44/75" />
      </div>

      <ol className="grid gap-2 sm:grid-cols-5">
        {(
          [
            { n: "01", label: "Learn", tab: "pipeline" as const, hint: "14 topics" },
            { n: "02", label: "Drill", tab: "drill" as const, hint: "Trailing knowledge" },
            { n: "03", label: "One-shot", tab: "oneshot" as const, hint: "Fire a question" },
            { n: "04", label: "Mocks", tab: "theory" as const, hint: "Timed 50" },
            { n: "05", label: "Weak", tab: "gauntlet" as const, hint: "Missed facts" },
          ] as const
        ).map((s) => (
          <li key={s.n}>
            <button
              type="button"
              onClick={() => go(s.tab)}
              className="flex h-full w-full items-center gap-3 rounded-[var(--radius-md)] bg-surface px-3 py-3 text-left shadow-[var(--shadow-border)]"
            >
              <span className="font-display text-lg font-semibold text-accent">{s.n}</span>
              <span>
                <span className="block text-sm font-medium">{s.label}</span>
                <span className="block text-xs text-subtle">{s.hint}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {next && nextTopic ? (
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SectionLabel>Next fact</SectionLabel>
            <p className="mt-1 font-display text-2xl font-semibold uppercase tracking-wide">{next.title}</p>
            <p className="text-sm text-muted">
              {nextTopic.n} {nextTopic.label} · {next.reference}
            </p>
          </div>
          <Button onClick={() => onOpen(next.topic)} className="min-h-12">
            Teach this
            <ArrowRight className="size-4" />
          </Button>
        </Card>
      ) : (
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge tone="pass">All 14 topics opened</Badge>
            <p className="mt-2 text-sm text-muted">
              Facts are marked studied. Drill trailing knowledge, fire one-shots, then sit a timed mock.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => go("drill")}>
              <Layers className="size-4" />
              Drill
            </Button>
            <Button onClick={() => go("oneshot")}>
              <Zap className="size-4" />
              One-shot
            </Button>
          </div>
        </Card>
      )}

      <div>
        <SectionLabel>Fourteen official categories</SectionLabel>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {TOPICS.map((t) => {
            const p = progress[t.id]!;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onOpen(t.id)}
                className="rounded-[var(--radius-lg)] bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] hover:shadow-[var(--shadow-border-hover)] active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                      {t.n}
                    </p>
                    <p className="font-display text-xl font-semibold uppercase tracking-wide">{t.label}</p>
                    <p className="mt-1 text-xs text-muted">{t.blurb}</p>
                  </div>
                  <p className="font-display text-2xl font-semibold tabular">{p.pct}%</p>
                </div>
                <Meter
                  className="mt-3"
                  value={p.pct}
                  tone={p.pct >= 80 ? "pass" : p.weak ? "fail" : "accent"}
                />
                <p className="mt-2 text-xs text-subtle">
                  {p.studied}/{p.total} studied
                  {p.weak ? ` · ${p.weak} weak` : ""}
                  {p.mastered ? ` · ${p.mastered} mastered` : ""}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <Card>
        <SectionLabel>What the 2026 paper actually is</SectionLabel>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>Multiple-choice: 50 questions, 57 minutes, pass 43. Five of the 50 are a linked case study.</li>
          <li>Hazard perception: 14 clips, 15 scored developing hazards, pass 44/75. Both parts, same sitting.</li>
          <li>Fee £23. Certificate valid 2 years. A car theory pass does not count for a motorcycle test.</li>
          <li>CPR and AED (5–6 cm, 100–120, 30:2, pad placement) are on current papers. H1/H2/H3 still are.</li>
          <li>Learner motorcyclists MUST NOT use motorways. Dual carriageways are allowed with L plates and CBT.</li>
        </ul>
      </Card>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "fail" | "pass" }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p
        className={cn(
          "font-display text-3xl font-semibold tabular",
          tone === "fail" && "text-fail",
          tone === "pass" && "text-pass",
        )}
      >
        {value}
      </p>
    </Card>
  );
}

function TopicStudy({
  topic,
  onBack,
  onOpenNext,
  go,
}: {
  topic: TopicId;
  onBack: () => void;
  onOpenNext: (id: TopicId) => void;
  go: (tab: TabId) => void;
}) {
  const facts = factsForTopic(topic);
  const meta = TOPICS.find((t) => t.id === topic)!;
  const studiedFacts = useAppStore((s) => s.studiedFacts);
  const start = Math.max(
    0,
    facts.findIndex((f) => !studiedFacts[f.id]),
  );
  const [idx, setIdx] = useState(start === -1 ? 0 : start);
  const [phase, setPhase] = useState<"teach" | "test">("teach");
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const markStudied = useAppStore((s) => s.markStudied);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const sound = useAppStore((s) => s.sound);
  const fact = facts[idx];
  const done = idx >= facts.length;

  const choices = useMemo(() => {
    if (!fact) return null;
    return shuffleChoices(fact.options, fact.correctIndex);
    // re-roll when the fact changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fact?.id]);

  function finishTeach(f: Fact) {
    markStudied(f.id);
    setPhase("test");
    setChosen(null);
    setRevealed(false);
  }

  function choose(i: number) {
    if (!fact || !choices || revealed) return;
    const ok = i === choices.correctIndex;
    haptic(ok ? "ok" : "bad", sound);
    recordAnswer({
      id: fact.id,
      correct: ok,
      sessionId: `learn_${fact.id}`,
      fault: ok ? null : fact.faultIfWrong,
    });
    markStudied(fact.id);
    setChosen(i);
    setRevealed(true);
  }

  function nextFact() {
    setIdx((n) => n + 1);
    setPhase("teach");
    setChosen(null);
    setRevealed(false);
  }

  if (done || !fact) {
    const nextMeta = TOPICS[(TOPICS.findIndex((t) => t.id === topic) + 1) % TOPICS.length]!;
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="size-4" />
          All topics
        </Button>
        <Card className="space-y-4">
          <Badge tone="pass">Topic complete</Badge>
          <h1 className="font-display text-4xl font-semibold uppercase tracking-wide">{meta.label}</h1>
          <p className="text-sm text-muted">
            You have been through all {facts.length} facts in this category. Drill the trailing knowledge, or keep
            walking the syllabus.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => go("drill")}>
              <Layers className="size-4" />
              Drill {meta.label}
            </Button>
            <Button variant="secondary" onClick={() => go("oneshot")}>
              <Zap className="size-4" />
              One-shot
            </Button>
            <Button variant="secondary" onClick={() => onOpenNext(nextMeta.id)}>
              Next: {nextMeta.label}
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="size-4" />
          Topics
        </Button>
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
          {meta.n} {meta.label}
          <span className="ml-2 tabular text-subtle">
            {idx + 1}/{facts.length}
          </span>
        </p>
      </div>
      <Meter value={((idx + (phase === "test" && revealed ? 1 : 0)) / facts.length) * 100} />

      <Card className="space-y-4">
        {phase === "teach" ? (
          <>
            <TeachPanel fact={fact} />
            <div className="flex flex-wrap gap-2">
              <Button className="min-h-12 flex-1" onClick={() => finishTeach(fact)}>
                <Target className="size-4" />
                Test this fact
              </Button>
              <Button
                variant="secondary"
                className="min-h-12"
                onClick={() => {
                  markStudied(fact.id);
                  nextFact();
                }}
              >
                <Check className="size-4" />I have this
              </Button>
            </div>
          </>
        ) : (
          <>
            <SectionLabel>Check you kept it</SectionLabel>
            <h2 className="font-display text-2xl font-semibold leading-snug tracking-wide">{fact.prompt}</h2>
            {choices ? (
              <ChoiceGrid
                options={choices.options}
                correctIndex={choices.correctIndex}
                chosen={chosen}
                revealed={revealed}
                onChoose={choose}
              />
            ) : null}
            {revealed ? <VerdictNote ok={chosen === choices?.correctIndex} fact={fact} /> : null}
            {revealed ? (
              <Button className="min-h-12 w-full" onClick={nextFact}>
                {idx + 1 >= facts.length ? "Finish topic" : "Next fact"}
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <p className="text-xs text-subtle">
                <BookOpen className="mr-1 inline size-3.5" />
                Pick one. The teach card comes back if you miss.
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
