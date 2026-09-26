import { useMemo, useState } from "react";
import { Zap } from "lucide-react";
import { ChoiceGrid, TeachPanel, VerdictNote } from "@/components/teach-panel";
import { Badge, Button, Card, SectionLabel } from "@/components/ui";
import { FACTS, TOPICS } from "@/data/facts";
import { haptic } from "@/lib/audio";
import { drawFact, shuffleChoices } from "@/lib/scoring";
import { useAppStore } from "@/lib/store";
import type { Fact, TopicId } from "@/lib/types";
import { uid } from "@/lib/utils";

export function OneshotView() {
  const [topic, setTopic] = useState<TopicId | "all">("all");
  const [shot, setShot] = useState<Fact | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [hits, setHits] = useState(0);
  const [taken, setTaken] = useState(0);
  const sessionId = useMemo(() => uid("shot"), []);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const markStudied = useAppStore((s) => s.markStudied);
  const sound = useAppStore((s) => s.sound);

  const choices = useMemo(() => {
    if (!shot) return null;
    return shuffleChoices(shot.options, shot.correctIndex);
  }, [shot]);

  function fire() {
    const next = drawFact(recent, topic === "all" ? undefined : topic);
    setRecent((r) => [next.id, ...r].slice(0, 12));
    setShot(next);
    setChosen(null);
    setRevealed(false);
  }

  function choose(i: number) {
    if (!shot || !choices || revealed) return;
    const ok = i === choices.correctIndex;
    haptic(ok ? "ok" : "bad", sound);
    recordAnswer({
      id: shot.id,
      correct: ok,
      sessionId,
      fault: ok ? null : shot.faultIfWrong,
    });
    markStudied(shot.id);
    setChosen(i);
    setRevealed(true);
    setTaken((n) => n + 1);
    if (ok) {
      setHits((n) => n + 1);
      setStreak((s) => {
        const n = s + 1;
        setBest((b) => Math.max(b, n));
        return n;
      });
    } else {
      setStreak(0);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>One-shot</SectionLabel>
          <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide">Fire a question</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            One Highway Code fact, four buttons, instant teach-back. Same bank the 2026 motorcycle paper draws from.
          </p>
        </div>
        <div className="flex gap-3">
          <Mini label="Streak" value={streak} />
          <Mini label="Best" value={best} />
          <Mini label="Hits" value={taken ? `${hits}/${taken}` : "0"} />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={topic === "all" ? "primary" : "secondary"} onClick={() => setTopic("all")}>
          Any topic
        </Button>
        {TOPICS.map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant={topic === t.id ? "primary" : "secondary"}
            onClick={() => setTopic(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {!shot ? (
        <Card className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="grid size-16 place-items-center rounded-[var(--radius-lg)] bg-accent text-accent-fg">
            <Zap className="size-7" />
          </span>
          <p className="max-w-sm text-sm text-muted">
            {FACTS.length} facts across 14 categories. Press the button. Answer. Repeat until the traps stop working.
          </p>
          <Button size="lg" className="min-h-14 min-w-48 text-base" onClick={fire}>
            <Zap className="size-5" />
            Fire
          </Button>
        </Card>
      ) : (
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{shot.title}</Badge>
            <Badge>{shot.reference}</Badge>
          </div>
          <h2 className="font-display text-2xl font-semibold leading-snug tracking-wide sm:text-3xl">{shot.prompt}</h2>
          {choices ? (
            <ChoiceGrid
              options={choices.options}
              correctIndex={choices.correctIndex}
              chosen={chosen}
              revealed={revealed}
              onChoose={choose}
            />
          ) : null}
          {revealed ? (
            <>
              <VerdictNote ok={chosen === choices?.correctIndex} fact={shot} />
              {chosen !== choices?.correctIndex ? <TeachPanel fact={shot} compact /> : null}
              <Button size="lg" className="min-h-12 w-full" onClick={fire}>
                <Zap className="size-4" />
                Next shot
              </Button>
            </>
          ) : null}
        </Card>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-surface px-3 py-2 text-right shadow-[var(--shadow-border)]">
      <p className="text-[11px] uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p className="font-display text-2xl font-semibold tabular">{value}</p>
    </div>
  );
}
