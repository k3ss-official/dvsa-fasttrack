import { useMemo, useState } from "react";
import { BookOpen, Infinity, Timer } from "lucide-react";
import { Badge, Button, Card, SectionLabel } from "@/components/ui";
import { QuizEngine, type QuizItem } from "@/components/quiz-engine";
import { FACTS } from "@/data/facts";
import { ALL_THEORY, CASES } from "@/data/theory";
import { generateTheoryPaper, mockSeed, THEORY_SECONDS } from "@/lib/scoring";
import { useAppStore } from "@/lib/store";
import type { TabId, TheoryQuestion } from "@/lib/types";

function toItem(q: TheoryQuestion): QuizItem {
  return {
    id: q.id,
    stem: q.stem,
    scenario: q.scenario,
    options: q.options,
    correctIndex: q.correctIndex,
    rationale: q.rationale,
    reference: q.reference,
    domain: q.domain,
    faultIfWrong: q.faultIfWrong,
  };
}

export function TheoryView({ go }: { go?: (tab: TabId) => void }) {
  const flagged = useAppStore((s) => s.flagged);
  const studiedFacts = useAppStore((s) => s.studiedFacts);
  const [paper, setPaper] = useState<{ label: string; items: QuizItem[] } | null>(null);
  const studiedN = Object.keys(studiedFacts).length;
  const ready = studiedN >= Math.ceil(FACTS.length * 0.5);

  const flaggedItems = useMemo(
    () => ALL_THEORY.filter((q) => flagged.includes(q.id)).map(toItem),
    [flagged],
  );

  if (paper) {
    return (
      <QuizEngine
        items={paper.items}
        kind="theory"
        label={paper.label}
        seconds={paper.label.includes("Flagged") || paper.label.includes("Case") ? undefined : THEORY_SECONDS}
        onClose={() => setPaper(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <SectionLabel>Timed mocks</SectionLabel>
        <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide">Sit the paper</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          50 questions, 57 minutes, five linked case-study items. Drawn from the facts you were taught plus extra
          exam-style stems. Pass 43. Do this after Learn and Drill — a mock does not teach.
        </p>
      </header>

      {!ready ? (
        <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge tone="warn">Study first</Badge>
            <p className="mt-2 text-sm text-muted">
              You have studied {studiedN} of {FACTS.length} facts. A mock now mostly measures luck. Walk the 14 topics,
              then come back.
            </p>
          </div>
          {go ? (
            <Button variant="secondary" onClick={() => go("pipeline")}>
              <BookOpen className="size-4" />
              Open Learn
            </Button>
          ) : null}
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <Card key={n} className="flex flex-col">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl font-semibold uppercase">Mock {n}</p>
              <Badge tone="accent">Fixed paper</Badge>
            </div>
            <p className="mt-2 flex-1 text-sm text-muted">
              Seeded set {n}. Same questions if you resit — useful for measuring process, not luck.
            </p>
            <Button
              className="mt-4"
              onClick={() =>
                setPaper({
                  label: `Theory mock ${n}`,
                  items: generateTheoryPaper(mockSeed("theory", n)).map(toItem),
                })
              }
            >
              <Timer className="size-4" />
              Start 57:00
            </Button>
          </Card>
        ))}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="font-display text-2xl font-semibold uppercase">Infinite</p>
            <Badge>Random</Badge>
          </div>
          <p className="mt-2 flex-1 text-sm text-muted">
            Fresh shuffle plus a random case study. Still 50 items, still a 57-minute clock.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() =>
              setPaper({
                label: "Theory mock · random",
                items: generateTheoryPaper(mockSeed("theory", "random")).map(toItem),
              })
            }
          >
            <Infinity className="size-4" />
            Draw a paper
          </Button>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <SectionLabel>Case studies</SectionLabel>
          <ul className="mt-3 space-y-2">
            {CASES.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-bg px-3 py-2">
                <div>
                  <p className="text-sm text-fg">{c.title}</p>
                  <p className="text-[11px] text-subtle">5 linked questions</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setPaper({
                      label: `Case · ${c.title}`,
                      items: ALL_THEORY.filter((q) => q.caseStudyId === c.id).map(toItem),
                    })
                  }
                >
                  Drill
                </Button>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <SectionLabel>Flagged review</SectionLabel>
          <p className="mt-2 text-sm text-muted">
            {flaggedItems.length
              ? `${flaggedItems.length} items parked for another look.`
              : "Flag anything in a mock to build a personal review list."}
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            disabled={!flaggedItems.length}
            onClick={() => setPaper({ label: "Flagged review", items: flaggedItems })}
          >
            <BookOpen className="size-4" />
            Review flagged
          </Button>
        </Card>
      </div>
    </div>
  );
}
