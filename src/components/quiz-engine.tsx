import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, BookmarkCheck, Clock, Flag } from "lucide-react";
import { Badge, Button, Card, Progress } from "@/components/ui";
import { Dl25Report } from "@/components/debrief";
import { haptic } from "@/lib/audio";
import { buildMock } from "@/lib/scoring";
import { useAppStore } from "@/lib/store";
import type { AnswerRecord, DomainId, FaultType, MockKind, MockResult } from "@/lib/types";
import { DOMAIN_LABEL } from "@/lib/types";
import { cn, formatTime, uid } from "@/lib/utils";

export interface QuizItem {
  id: string;
  stem: string;
  scenario?: string;
  options: [string, string, string, string];
  correctIndex: number;
  rationale: string;
  reference: string;
  domain: DomainId;
  faultIfWrong: FaultType;
}

export function QuizEngine({
  items,
  kind,
  label,
  seconds,
  instant = false,
  onClose,
}: {
  items: QuizItem[];
  kind: MockKind;
  label: string;
  seconds?: number;
  instant?: boolean;
  onClose: () => void;
}) {
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const saveMock = useAppStore((s) => s.saveMock);
  const flagged = useAppStore((s) => s.flagged);
  const toggleFlag = useAppStore((s) => s.toggleFlag);
  const sound = useAppStore((s) => s.sound);

  const sessionId = useMemo(() => uid("sess"), []);
  const started = useRef(Date.now());
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [remain, setRemain] = useState(seconds ?? 0);
  const [result, setResult] = useState<MockResult | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const item = items[index];
  const done = Boolean(result);

  useEffect(() => {
    if (!seconds || done) return;
    const t = window.setInterval(() => {
      setRemain((r) => {
        if (r <= 1) {
          window.clearInterval(t);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [seconds, done]);

  useEffect(() => {
    if (seconds && remain === 0 && !done && items.length) {
      finish(answersRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remain]);

  if (!item && !done) {
    return (
      <Card>
        <p className="text-sm text-muted">No items in this paper.</p>
        <Button className="mt-3" onClick={onClose}>
          Back
        </Button>
      </Card>
    );
  }

  function commit(choice: number) {
    if (!item || revealed) return;
    const correct = choice === item.correctIndex;
    haptic(correct ? "ok" : "bad", sound);
    const rec: AnswerRecord = {
      id: item.id,
      correct,
      chosen: choice,
      faultType: correct ? null : item.faultIfWrong,
      stem: item.stem,
      rationale: item.rationale,
      reference: item.reference,
      domain: item.domain,
      flagged: flagged.includes(item.id),
    };
    recordAnswer({
      id: item.id,
      correct,
      sessionId,
      fault: rec.faultType,
    });
    const nextAnswers = [...answers, rec];
    setAnswers(nextAnswers);
    setChosen(choice);
    setRevealed(true);
    if (!instant) return;
    window.setTimeout(() => {
      advance(nextAnswers);
    }, 650);
  }

  function advance(from = answers) {
    if (index + 1 >= items.length) {
      finish(from);
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
    setRevealed(false);
  }

  function finish(from: AnswerRecord[]) {
    const scored = from.filter((a) => a.correct).length;
    const mock = buildMock({
      kind,
      label,
      answers: from,
      durationSec: Math.round((Date.now() - started.current) / 1000),
      score: scored,
      maxScore: items.length,
    });
    saveMock(mock);
    haptic(mock.verdict === "PASS" ? "pass" : "bad", sound);
    setResult(mock);
  }

  if (result) {
    return <Dl25Report result={result} onClose={onClose} onAgain={onClose} />;
  }

  const letters = ["A", "B", "C", "D"] as const;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
            {label}
          </p>
          <p className="font-display text-2xl font-semibold uppercase tracking-wide">
            {index + 1}
            <span className="text-muted"> / {items.length}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {seconds ? (
            <span
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-[var(--radius-md)] bg-surface px-3 font-mono text-sm tabular shadow-[var(--shadow-border)]",
                remain < 120 && "text-fail",
              )}
            >
              <Clock className="size-4" />
              {formatTime(remain)}
            </span>
          ) : null}
          <Button variant="ghost" onClick={onClose}>
            Abort
          </Button>
        </div>
      </div>
      <Progress value={((index + (revealed ? 1 : 0)) / items.length) * 100} />

      {item.scenario ? (
        <Card className="bg-surface-2">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Case study
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{item.scenario}</p>
        </Card>
      ) : null}

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{DOMAIN_LABEL[item.domain]}</Badge>
          {item.scenario ? <Badge tone="accent">Linked scenario</Badge> : null}
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-wide">
          {item.stem}
        </h2>
        <div className="mt-4 grid gap-2">
          {item.options.map((opt, i) => {
            const isChosen = chosen === i;
            const isCorrect = i === item.correctIndex;
            const show = revealed;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => commit(i)}
                disabled={revealed}
                className={cn(
                  "min-h-12 rounded-[var(--radius-md)] px-3 py-3 text-left text-sm shadow-[var(--shadow-border)] transition-[background-color,box-shadow,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
                  "hover:bg-surface-2 disabled:cursor-default",
                  !show && isChosen && "bg-surface-2",
                  show && isCorrect && "bg-pass/15 text-fg shadow-[0_0_0_1px_rgba(52,211,153,0.45)]",
                  show && isChosen && !isCorrect && "bg-fail/15 shadow-[0_0_0_1px_rgba(251,113,133,0.45)]",
                )}
              >
                <span className="mr-2 font-mono text-xs text-subtle">{letters[i]} </span>
                {opt}
              </button>
            );
          })}
        </div>

        {revealed && !instant ? (
          <div className="mt-4 rounded-[var(--radius-md)] bg-bg p-3 text-sm">
            <p className={cn("font-medium", chosen === item.correctIndex ? "text-pass" : "text-fail")}>
              {chosen === item.correctIndex ? "Correct" : "Incorrect"} · {item.reference}
            </p>
            <p className="mt-1 text-muted">{item.rationale}</p>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toggleFlag(item.id);
              haptic("tap", sound);
            }}
          >
            {flagged.includes(item.id) ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            {flagged.includes(item.id) ? "Flagged" : "Flag"}
          </Button>
          {!instant ? (
            <Button onClick={() => advance()} disabled={!revealed}>
              {index + 1 >= items.length ? "Debrief" : "Next"}
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-subtle">
              <Flag className="size-3.5" /> Rapid fire
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
