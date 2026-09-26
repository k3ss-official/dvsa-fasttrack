import { useMemo, useState } from "react";
import { Check, Circle } from "lucide-react";
import { Badge, Button, Card, SectionLabel } from "@/components/ui";
import { QuizEngine, type QuizItem } from "@/components/quiz-engine";
import { MOD2_TRAPS } from "@/data/checklists";
import { MOD2_SCENARIOS } from "@/data/mod2";
import { SHOW_ME_TELL_ME } from "@/data/show-me";
import { generateMod2Paper, mockSeed } from "@/lib/scoring";
import { haptic } from "@/lib/audio";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Pane = "traps" | "road" | "smtm";

export function Mod2View() {
  const [pane, setPane] = useState<Pane>("traps");
  const [run, setRun] = useState(false);
  const checklists = useAppStore((s) => s.checklists);
  const toggle = useAppStore((s) => s.toggleChecklist);
  const sound = useAppStore((s) => s.sound);

  const paper: QuizItem[] = useMemo(
    () =>
      generateMod2Paper(mockSeed("mod2", "random")).map((s) => ({
        id: s.id,
        stem: s.title + " — " + s.situation,
        options: s.options,
        correctIndex: s.correctIndex,
        rationale: s.rationale,
        reference: s.reference,
        domain: s.domain,
        faultIfWrong: s.faultIfWrong,
      })),
    [run],
  );

  if (run) {
    return (
      <QuizEngine items={paper} kind="mod2" label="Module 2 road scenarios" onClose={() => setRun(false)} />
    );
  }

  const groups = [...new Set(MOD2_TRAPS.map((t) => t.group))];
  const done = MOD2_TRAPS.filter((t) => checklists[t.id]).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Module 2 · experienced-rider traps</SectionLabel>
          <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide">Road audit</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Veterans fail on process: missed lifesavers, gutter position, straight-lined mini-roundabouts, panicking a
            sat-nav miss. 25 visual decisions plus the official Show Me, Tell Me bank.
          </p>
        </div>
        <Button onClick={() => setRun(true)}>Sit 25 scenarios</Button>
      </header>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["traps", "Trap audit"],
            ["road", "Road diagrams"],
            ["smtm", "Show me, tell me"],
          ] as const
        ).map(([id, label]) => (
          <Button key={id} variant={pane === id ? "primary" : "secondary"} size="sm" onClick={() => setPane(id)}>
            {label}
          </Button>
        ))}
      </div>

      {pane === "traps" ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            {done}/{MOD2_TRAPS.length} drilled. Toggle when you have actually practised the item, not when you have
            merely read it.
          </p>
          {groups.map((g) => (
            <Card key={g}>
              <SectionLabel>{g}</SectionLabel>
              <ul className="mt-3 space-y-2">
                {MOD2_TRAPS.filter((t) => t.group === g).map((t) => {
                  const on = Boolean(checklists[t.id]);
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => {
                          toggle(t.id);
                          haptic("tap", sound);
                        }}
                        className={cn(
                          "flex min-h-12 w-full items-start gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left shadow-[var(--shadow-border)]",
                          on && "bg-pass/10",
                        )}
                      >
                        {on ? <Check className="mt-0.5 size-5 text-pass" /> : <Circle className="mt-0.5 size-5 text-subtle" />}
                        <span>
                          <span className="block text-sm font-medium">{t.label}</span>
                          <span className="mt-0.5 block text-xs text-muted">{t.detail}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      ) : null}

      {pane === "road" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {MOD2_SCENARIOS.slice(0, 8).map((s) => (
            <Card key={s.id}>
              <RoadGlyph kind={s.visual} />
              <div className="mt-3 flex items-center gap-2">
                <Badge>{s.dl25Category}</Badge>
                <Badge tone={s.faultIfWrong === "Minor" ? "warn" : "fail"}>{s.faultIfWrong}</Badge>
              </div>
              <h2 className="mt-2 font-display text-xl font-semibold uppercase tracking-wide">{s.title}</h2>
              <p className="mt-1 text-sm text-muted">{s.situation}</p>
            </Card>
          ))}
          <Card className="sm:col-span-2">
            <p className="text-sm text-muted">
              Full 25-item paper randomises the rest (spirals, filtering, school gates, hill starts, wet metal). Sit it
              from the header button.
            </p>
          </Card>
        </div>
      ) : null}

      {pane === "smtm" ? <ShowMeBank /> : null}
    </div>
  );
}

function ShowMeBank() {
  const [open, setOpen] = useState<string | null>(SHOW_ME_TELL_ME[0]?.id ?? null);
  return (
    <div className="space-y-2">
      {SHOW_ME_TELL_ME.map((q) => {
        const on = open === q.id;
        return (
          <Card key={q.id} className="p-0">
            <button
              type="button"
              className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left"
              onClick={() => setOpen(on ? null : q.id)}
            >
              <span className="text-sm font-medium">{q.prompt}</span>
              <Badge tone={q.kind === "show" ? "accent" : "neutral"}>{q.kind === "show" ? "Show me" : "Tell me"}</Badge>
            </button>
            {on ? (
              <div className="border-t border-border px-4 py-3 text-sm text-muted">
                <p className="text-fg">{q.answer}</p>
                <p className="mt-2 text-xs text-subtle">{q.reference}</p>
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}

function RoadGlyph({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 240 90" className="h-20 w-full rounded-[var(--radius-sm)] bg-bg">
      <rect x="20" y="38" width="200" height="16" fill="#27272c" />
      {kind === "roundabout" || kind === "spiral" || kind === "mini-roundabout" ? (
        <circle cx="120" cy="46" r={kind === "mini-roundabout" ? 10 : 22} fill="none" stroke="#f59e0b" strokeWidth="3" />
      ) : null}
      {kind === "t-junction" || kind === "blind" ? (
        <rect x="108" y="10" width="16" height="40" fill="#27272c" />
      ) : null}
      {kind === "crossroads" ? (
        <>
          <rect x="108" y="8" width="16" height="74" fill="#27272c" />
        </>
      ) : null}
      <circle cx="70" cy="46" r="6" fill="#f4f4f5" />
      {kind === "lifesaver" ? (
        <path d="M70 46 L92 28" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#a)" />
      ) : null}
      <text x="28" y="80" fill="#71717a" fontSize="9">
        {kind}
      </text>
    </svg>
  );
}
