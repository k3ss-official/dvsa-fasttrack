import { useMemo, useState } from "react";
import { Badge, Button, Card, SectionLabel } from "@/components/ui";
import { QuizEngine, type QuizItem } from "@/components/quiz-engine";
import { MOD1_EXERCISES, MOD1_PROMPTS } from "@/data/mod1";
import { generateMod1Paper, mockSeed, speedTrap } from "@/lib/scoring";
import { cn, kmhToMph } from "@/lib/utils";

export function Mod1View() {
  const [selected, setSelected] = useState(MOD1_EXERCISES[0]!.id);
  const [kmh, setKmh] = useState(52);
  const [run, setRun] = useState(false);
  const ex = MOD1_EXERCISES.find((e) => e.id === selected) ?? MOD1_EXERCISES[0]!;
  const trap = speedTrap(kmh);
  const mph = kmhToMph(kmh);

  const paper: QuizItem[] = useMemo(
    () =>
      generateMod1Paper(mockSeed("mod1", "random")).map((p) => ({
        id: p.id,
        stem: p.prompt,
        options: p.options,
        correctIndex: p.correctIndex,
        rationale: p.rationale,
        reference: p.reference,
        domain: p.domain,
        faultIfWrong: p.faultIfWrong,
      })),
    [run],
  );

  if (run) {
    return (
      <QuizEngine
        items={paper}
        kind="mod1"
        label="Module 1 yard run"
        onClose={() => setRun(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Module 1 · MMA</SectionLabel>
          <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide">Yard handling arena</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Eight exercises, official speed rules, and the traps that fail riders who can already ride. A/A2 DAS:
            50 km/h through the beam or you are in the DT1 footnote.
          </p>
        </div>
        <Button onClick={() => setRun(true)}>Start yard run</Button>
      </header>

      <Card className="overflow-hidden p-0">
        <MmaDiagram selected={selected} onSelect={setSelected} />
      </Card>

      <div className="grid gap-3 lg:grid-cols-5">
        <div className="flex gap-2 overflow-x-auto lg:col-span-2 lg:flex-col">
          {MOD1_EXERCISES.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setSelected(e.id)}
              className={cn(
                "min-h-11 shrink-0 rounded-[var(--radius-md)] px-3 py-2 text-left shadow-[var(--shadow-border)]",
                selected === e.id ? "bg-accent text-accent-fg" : "bg-surface text-fg",
              )}
            >
              <span className="font-mono text-[11px] opacity-70">{String(e.step).padStart(2, "0")}</span>
              <span className="ml-2 text-sm font-medium">{e.name}</span>
            </button>
          ))}
        </div>
        <Card className="lg:col-span-3">
          <Badge tone="accent">Exercise {ex.step} / 8</Badge>
          <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide">{ex.name}</h2>
          <p className="mt-2 text-sm text-muted">{ex.brief}</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-subtle">How</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-fg">
            {ex.how.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-subtle">Pass</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-pass">
            {ex.passCriteria.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-subtle">Faults</p>
          <ul className="mt-1 space-y-1 text-sm">
            {ex.failModes.map((f) => (
              <li key={f.text} className="flex gap-2">
                <Badge tone={f.fault === "Minor" ? "warn" : "fail"}>{f.fault}</Badge>
                <span className="text-muted">{f.text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-subtle">{ex.reference}</p>
        </Card>
      </div>

      <Card>
        <SectionLabel>Speed trap calculator · DT1</SectionLabel>
        <p className="mt-1 text-sm text-muted">
          Emergency stop and avoidance, category A/A2. The pad gun reads km/h. Your speedo reads mph.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.14em] text-subtle">Entry speed km/h</span>
            <input
              type="range"
              min={30}
              max={70}
              step={1}
              value={kmh}
              onChange={(e) => setKmh(Number(e.target.value))}
              className="mt-3 w-full accent-accent"
            />
            <input
              type="number"
              min={0}
              max={120}
              value={kmh}
              onChange={(e) => setKmh(Number(e.target.value))}
              className="mt-3 h-11 w-full rounded-[var(--radius-md)] bg-bg px-3 font-mono tabular text-fg shadow-[var(--shadow-border)]"
            />
          </label>
          <div
            className={cn(
              "rounded-[var(--radius-md)] p-4",
              trap.band === "pass" && "bg-pass/10",
              trap.band === "minor" && "bg-warn/10",
              trap.band === "fail" && "bg-fail/10",
            )}
          >
            <p className="font-display text-4xl font-semibold tabular">
              {kmh} <span className="text-lg text-muted">km/h</span>
            </p>
            <p className="font-mono text-sm tabular text-muted">{mph.toFixed(1)} mph · DVSA says “about 32 mph” at 50</p>
            <Badge className="mt-3" tone={trap.band === "pass" ? "pass" : trap.band === "minor" ? "warn" : "fail"}>
              {trap.label}
            </Badge>
            <p className="mt-2 text-sm text-muted">{trap.detail}</p>
          </div>
        </div>
      </Card>

      <Card>
        <SectionLabel>Edge-case bank</SectionLabel>
        <p className="mt-2 text-sm text-muted">
          {MOD1_PROMPTS.length} randomised prompts (wind, 49 vs 52 km/h, foot dabs, wet pad, linked brakes) sit behind
          the yard-run button.
        </p>
      </Card>
    </div>
  );
}

function MmaDiagram({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const hot = (id: string) => (selected === id ? "#f59e0b" : "#3f3f46");
  return (
    <svg viewBox="0 0 640 280" className="h-auto w-full" role="img" aria-label="DVSA multi-purpose test site schematic">
      <rect width="640" height="280" fill="#121214" />
      <rect x="24" y="24" width="592" height="232" fill="#1a1a1e" stroke="#27272c" />
      <text x="36" y="44" fill="#71717a" fontSize="11" fontFamily="IBM Plex Sans">
        MMA schematic · not a surveyed pad
      </text>
      {/* speed strip */}
      <rect x="48" y="200" width="420" height="36" fill="#141416" stroke={hot("m1_estop")} />
      <text x="56" y="222" fill="#a1a1aa" fontSize="10">
        SPEED STRIP · 50 km/h beam
      </text>
      <line x1="300" y1="200" x2="300" y2="236" stroke="#f59e0b" strokeDasharray="3 3" />
      {/* avoidance gate */}
      <circle cx="430" cy="208" r="6" fill="#fb7185" />
      <circle cx="458" cy="228" r="6" fill="#38bdf8" />
      <rect
        x="500"
        y="198"
        width="70"
        height="40"
        fill="none"
        stroke={hot("m1_avoid")}
        onClick={() => onSelect("m1_avoid")}
        className="cursor-pointer"
      />
      <text x="508" y="222" fill="#a1a1aa" fontSize="10">
        BAY
      </text>
      {/* slow area */}
      <g className="cursor-pointer" onClick={() => onSelect("m1_slalom")}>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={90 + i * 36} cy={90 + (i % 2) * 18} r="6" fill={hot("m1_slalom")} />
        ))}
        <text x="88" y="70" fill="#a1a1aa" fontSize="10">
          SLALOM 4.5 m
        </text>
      </g>
      <g className="cursor-pointer" onClick={() => onSelect("m1_fig8")}>
        <circle cx="310" cy="96" r="34" fill="none" stroke={hot("m1_fig8")} strokeWidth="2" />
        <circle cx="372" cy="96" r="34" fill="none" stroke={hot("m1_fig8")} strokeWidth="2" />
        <text x="318" y="58" fill="#a1a1aa" fontSize="10">
          FIGURE 8
        </text>
      </g>
      <g className="cursor-pointer" onClick={() => onSelect("m1_uturn")}>
        <rect x="460" y="56" width="130" height="70" fill="none" stroke={hot("m1_uturn")} />
        <path d="M470 110 C520 40, 560 40, 580 110" fill="none" stroke="#f4f4f5" strokeWidth="2" />
        <text x="488" y="48" fill="#a1a1aa" fontSize="10">
          U-TURN BOX
        </text>
      </g>
      <g className="cursor-pointer" onClick={() => onSelect("m1_slow")}>
        <line x1="80" y1="160" x2="260" y2="160" stroke={hot("m1_slow")} strokeWidth="3" />
        <text x="80" y="152" fill="#a1a1aa" fontSize="10">
          SLOW RIDE
        </text>
      </g>
      <g className="cursor-pointer" onClick={() => onSelect("m1_cstop")}>
        <rect x="280" y="148" width="70" height="28" fill="none" stroke={hot("m1_cstop")} />
        <text x="286" y="142" fill="#a1a1aa" fontSize="10">
          CTRL STOP
        </text>
      </g>
      <g className="cursor-pointer" onClick={() => onSelect("m1_stand")}>
        <rect x="560" y="148" width="36" height="36" fill="none" stroke={hot("m1_stand")} />
        <text x="516" y="170" fill="#a1a1aa" fontSize="10">
          BOX
        </text>
      </g>
      <g className="cursor-pointer" onClick={() => onSelect("m1_estop")}>
        <text x="56" y="258" fill={hot("m1_estop")} fontSize="11">
          EMERGENCY STOP
        </text>
      </g>
    </svg>
  );
}
