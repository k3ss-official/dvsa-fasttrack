import { useMemo, useState } from "react";
import { Hash, Layers, RotateCcw, Shuffle, X } from "lucide-react";
import { ChoiceGrid, TeachPanel, VerdictNote } from "@/components/teach-panel";
import { Badge, Button, Card, Meter, SectionLabel } from "@/components/ui";
import { TOPICS } from "@/data/facts";
import { haptic } from "@/lib/audio";
import { numberBank, shuffleChoices, trailingDeck } from "@/lib/scoring";
import { useAppStore } from "@/lib/store";
import type { TopicId } from "@/lib/types";
import { cn, shuffle as shuffleArr, uid } from "@/lib/utils";

type Mode = "flash" | "tf" | "number" | "mix";

const MODES: { id: Mode; label: string; hint: string; icon: typeof Layers }[] = [
  { id: "flash", label: "Flashcards", hint: "Read, flip, then answer", icon: RotateCcw },
  { id: "tf", label: "True or false", hint: "Trap statements, two buttons", icon: Layers },
  { id: "number", label: "Number snap", hint: "Distances, limits, CPR", icon: Hash },
  { id: "mix", label: "Trailing mix", hint: "Weak and unstudied first", icon: Shuffle },
];

export function DrillView() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [topic, setTopic] = useState<TopicId | "all">("all");
  if (mode) {
    return <DrillRun mode={mode} topic={topic} onClose={() => setMode(null)} />;
  }
  return (
    <div className="space-y-6">
      <header>
        <SectionLabel>Trailing knowledge</SectionLabel>
        <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide">Drill the facts in</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Games on the same Highway Code bank. Weak and unread facts come first. Sit a mock only after these stop
          surprising you.
        </p>
      </header>

      <Card>
        <SectionLabel>Filter</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant={topic === "all" ? "primary" : "secondary"} onClick={() => setTopic("all")}>
            All 14
          </Button>
          {TOPICS.map((t) => (
            <Button
              key={t.id}
              size="sm"
              variant={topic === t.id ? "primary" : "secondary"}
              onClick={() => setTopic(t.id)}
            >
              {t.n} {t.label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {MODES.map((m) => (
          <Card key={m.id} className="flex flex-col">
            <div className="flex items-center gap-2">
              <m.icon className="size-4 text-accent" />
              <p className="font-display text-2xl font-semibold uppercase">{m.label}</p>
            </div>
            <p className="mt-2 flex-1 text-sm text-muted">{m.hint}</p>
            <Button className="mt-4 min-h-12" onClick={() => setMode(m.id)}>
              Start {m.label.toLowerCase()}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DrillRun({
  mode,
  topic,
  onClose,
}: {
  mode: Mode;
  topic: TopicId | "all";
  onClose: () => void;
}) {
  const ledger = useAppStore((s) => s.ledger);
  const studied = useAppStore((s) => s.studiedFacts);
  const t = topic === "all" ? undefined : topic;
  const deck = useMemo(() => {
    if (mode === "number") {
      const bank = numberBank(t);
      return shuffleArr(bank.length ? bank : numberBank());
    }
    return trailingDeck(ledger, studied, 16, t);
    // Snapshot the queue for this run so answering does not reshuffle under the cursor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, t]);

  const [i, setI] = useState(0);
  const [score, setScore] = useState({ ok: 0, n: 0 });
  const [flipped, setFlipped] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [tfPick, setTfPick] = useState<boolean | null>(null);
  const sessionId = useMemo(() => uid("drill"), []);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const markStudied = useAppStore((s) => s.markStudied);
  const sound = useAppStore((s) => s.sound);

  const fact = deck[i % Math.max(deck.length, 1)];
  const choices = useMemo(() => {
    if (!fact) return null;
    if (mode === "number" && fact.number) {
      const opts = shuffleArr([fact.number.correct, ...fact.number.decoys]) as [string, string, string, string];
      return {
        prompt: fact.number.ask,
        options: opts,
        correctIndex: opts.indexOf(fact.number.correct) as 0 | 1 | 2 | 3,
      };
    }
    const mixed = shuffleChoices(fact.options, fact.correctIndex);
    return { prompt: fact.prompt, ...mixed };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fact?.id, mode, i]);

  if (!fact || !deck.length) {
    return (
      <Card>
        <p className="text-sm text-muted">No facts in this filter yet.</p>
        <Button className="mt-3" onClick={onClose}>
          Back
        </Button>
      </Card>
    );
  }

  function commitMcq(idx: number) {
    if (!fact || !choices || revealed) return;
    const ok = idx === choices.correctIndex;
    finish(ok);
    setChosen(idx);
    setRevealed(true);
  }

  function commitTf(answer: boolean) {
    if (tfPick !== null) return;
    const ok = answer === fact.tf.answer;
    finish(ok);
    setTfPick(answer);
    setRevealed(true);
  }

  function finish(ok: boolean) {
    haptic(ok ? "ok" : "bad", sound);
    recordAnswer({
      id: fact.id,
      correct: ok,
      sessionId,
      fault: ok ? null : fact.faultIfWrong,
    });
    markStudied(fact.id);
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), n: s.n + 1 }));
  }

  function next() {
    setI((n) => n + 1);
    setFlipped(false);
    setChosen(null);
    setRevealed(false);
    setTfPick(null);
  }

  const showMcq = mode === "mix" || mode === "number" || (mode === "flash" && flipped);
  const pct = score.n ? Math.round((score.ok / score.n) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
            {MODES.find((m) => m.id === mode)?.label}
          </p>
          <p className="font-display text-2xl font-semibold uppercase tracking-wide">
            {score.ok}
            <span className="text-muted"> / {score.n || 0}</span>
            <span className="ml-2 text-sm text-subtle">{pct}%</span>
          </p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          <X className="size-4" />
          End drill
        </Button>
      </div>
      <Meter value={pct} tone={pct >= 80 ? "pass" : pct < 50 && score.n > 3 ? "fail" : "accent"} />

      <Card className="space-y-4">
        {mode === "flash" && !flipped ? (
          <>
            <TeachPanel fact={fact} />
            <Button className="min-h-12 w-full" onClick={() => setFlipped(true)}>
              Flip — test me
            </Button>
          </>
        ) : null}

        {mode === "tf" ? (
          <>
            <Badge>True or false</Badge>
            <h2 className="font-display text-2xl font-semibold leading-snug tracking-wide">{fact.tf.statement}</h2>
            <div className="grid grid-cols-2 gap-2">
              <TfBtn
                label="True"
                ok={true}
                pick={tfPick}
                answer={fact.tf.answer}
                onPick={commitTf}
              />
              <TfBtn
                label="False"
                ok={false}
                pick={tfPick}
                answer={fact.tf.answer}
                onPick={commitTf}
              />
            </div>
            {revealed ? <VerdictNote ok={tfPick === fact.tf.answer} fact={fact} /> : null}
          </>
        ) : null}

        {showMcq && choices ? (
          <>
            {mode === "flash" ? <TeachPanel fact={fact} compact /> : <Badge>{fact.title}</Badge>}
            <h2 className="font-display text-2xl font-semibold leading-snug tracking-wide">{choices.prompt}</h2>
            <ChoiceGrid
              options={choices.options}
              correctIndex={choices.correctIndex}
              chosen={chosen}
              revealed={revealed}
              onChoose={commitMcq}
            />
            {revealed ? <VerdictNote ok={chosen === choices.correctIndex} fact={fact} /> : null}
          </>
        ) : null}

        {revealed ? (
          <Button className="min-h-12 w-full" onClick={next}>
            Next
          </Button>
        ) : null}
      </Card>
    </div>
  );
}

function TfBtn({
  label,
  ok,
  pick,
  answer,
  onPick,
}: {
  label: string;
  ok: boolean;
  pick: boolean | null;
  answer: boolean;
  onPick: (v: boolean) => void;
}) {
  const revealed = pick !== null;
  const isCorrect = ok === answer;
  const isChosen = pick === ok;
  return (
    <button
      type="button"
      onClick={() => onPick(ok)}
      disabled={revealed}
      className={cn(
        "min-h-16 rounded-[var(--radius-md)] font-display text-2xl font-semibold uppercase tracking-wide shadow-[var(--shadow-border)]",
        !revealed && "hover:bg-surface-2",
        revealed && isCorrect && "bg-pass/15 text-pass",
        revealed && isChosen && !isCorrect && "bg-fail/15 text-fail",
      )}
    >
      {label}
    </button>
  );
}
