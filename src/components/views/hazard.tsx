import { useEffect, useMemo, useRef, useState } from "react";
import { MousePointerClick, Pause, Play, RotateCcw } from "lucide-react";
import { Badge, Button, Card, SectionLabel } from "@/components/ui";
import { HAZARD_CLIPS } from "@/data/hazard";
import { haptic } from "@/lib/audio";
import { HAZARD_PASS, HAZARD_TOTAL } from "@/lib/scoring";
import { useAppStore } from "@/lib/store";
import type { HazardClip } from "@/lib/types";
import { cn } from "@/lib/utils";

type ClipResult = {
  id: string;
  points: number;
  clicks: number;
  cheated: boolean;
  firstAt: number | null;
};

export function HazardView() {
  const sound = useAppStore((s) => s.sound);
  const setHazardBest = useAppStore((s) => s.setHazardBest);
  const [clipIndex, setClipIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [clicks, setClicks] = useState<number[]>([]);
  const [results, setResults] = useState<ClipResult[]>([]);
  const [showCoach, setShowCoach] = useState(true);
  const raf = useRef<number>(0);
  const t0 = useRef(0);

  const clip = HAZARD_CLIPS[clipIndex]!;
  const finished = results.length === HAZARD_CLIPS.length && !running;
  const total = results.reduce((s, r) => s + (r.cheated ? 0 : r.points), 0);
  const scaled = Math.round((total / (HAZARD_CLIPS.length * 5)) * HAZARD_TOTAL);

  useEffect(() => {
    if (!running) return;
    t0.current = performance.now() - elapsed;
    const loop = (now: number) => {
      const e = now - t0.current;
      if (e >= clip.durationMs) {
        setElapsed(clip.durationMs);
        setRunning(false);
        settle(clip, clicks, clip.durationMs);
        return;
      }
      setElapsed(e);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, clip.id]);

  useEffect(() => {
    if (finished) setHazardBest(scaled);
  }, [finished, scaled, setHazardBest]);

  function settle(c: HazardClip, clk: number[], at: number) {
    const developing = clk.filter((t) => t >= c.hazardStartMs);
    const cheated = clk.length >= c.cheatClicks;
    const first = developing[0] ?? null;
    let points = 0;
    if (first !== null && !cheated) {
      const rel = first - c.hazardStartMs;
      const win = c.windows.find((w) => rel >= w.from && rel < w.to);
      points = win?.points ?? 0;
    }
    setResults((prev) => {
      const rest = prev.filter((r) => r.id !== c.id);
      return [...rest, { id: c.id, points, clicks: clk.length, cheated, firstAt: first }];
    });
    void at;
  }

  function click() {
    if (!running) return;
    haptic("tap", sound);
    setClicks((c) => [...c, elapsed]);
  }

  function start() {
    setClicks([]);
    setElapsed(0);
    setRunning(true);
  }

  function next() {
    setClicks([]);
    setElapsed(0);
    setRunning(false);
    setClipIndex((i) => Math.min(HAZARD_CLIPS.length - 1, i + 1));
  }

  function resetAll() {
    setResults([]);
    setClipIndex(0);
    setClicks([]);
    setElapsed(0);
    setRunning(false);
  }

  const progress = elapsed / clip.durationMs;
  const inHazard = elapsed >= clip.hazardStartMs;
  const rel = elapsed - clip.hazardStartMs;
  const liveWindow = inHazard ? clip.windows.find((w) => rel >= w.from && rel < w.to) : null;
  const thisResult = results.find((r) => r.id === clip.id);

  return (
    <div className="space-y-6">
      <header>
        <SectionLabel>Hazard perception cadence</SectionLabel>
        <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide">
          3-click rhythm, not a spray
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          DVSA scores the first click inside the developing-hazard window, 5 down to 1. A click pattern that looks like
          cheating zeros the clip. Aim: one click as it develops, maybe a second, never a drum-roll.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="accent">
          Clip {clipIndex + 1}/{HAZARD_CLIPS.length}
        </Badge>
        <Badge>Pass mark {HAZARD_PASS}/{HAZARD_TOTAL}</Badge>
        <Badge tone={scaled >= HAZARD_PASS ? "pass" : "neutral"}>Scaled {scaled}/75</Badge>
        <label className="ml-auto flex h-11 items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={showCoach}
            onChange={(e) => setShowCoach(e.target.checked)}
            className="size-4 accent-accent"
          />
          Cadence coach
        </label>
      </div>

      <Card className="overflow-hidden p-0">
        <RoadStage clip={clip} progress={progress} inHazard={inHazard} />
        <div className="space-y-3 p-4">
          <p className="font-display text-xl font-semibold uppercase tracking-wide">{clip.title}</p>
          <Timeline clip={clip} elapsed={elapsed} clicks={clicks} showCoach={showCoach} />
          <div className="flex flex-wrap items-center gap-2">
            {!running && elapsed === 0 ? (
              <Button onClick={start}>
                <Play className="size-4" /> Start clip
              </Button>
            ) : running ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setRunning(false);
                  cancelAnimationFrame(raf.current);
                }}
              >
                <Pause className="size-4" /> Pause
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setRunning(true)}>
                <Play className="size-4" /> Resume
              </Button>
            )}
            <Button
              variant={running ? "primary" : "outline"}
              onClick={click}
              disabled={!running}
              className="min-w-36"
            >
              <MousePointerClick className="size-4" /> Click hazard
            </Button>
            {!running && elapsed >= clip.durationMs ? (
              <Button variant="ghost" onClick={next} disabled={clipIndex >= HAZARD_CLIPS.length - 1}>
                Next clip
              </Button>
            ) : null}
            <span className="ml-auto font-mono text-sm tabular text-muted">
              {Math.round(elapsed / 100) / 10}s
              {liveWindow ? ` · window ${liveWindow.points}` : inHazard ? " · window closed" : ""}
            </span>
          </div>
          {thisResult && !running ? (
            <p className={cn("text-sm", thisResult.cheated ? "text-fail" : "text-muted")}>
              {thisResult.cheated
                ? `Cheat pattern: ${thisResult.clicks} clicks. Clip scored 0. Double-tap, do not machine-gun.`
                : `Scored ${thisResult.points}/5 from ${thisResult.clicks} click(s).`}
            </p>
          ) : null}
        </div>
      </Card>

      {showCoach ? (
        <Card>
          <SectionLabel>Cadence coach</SectionLabel>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
            <li>Scan. Do not click parked cars, road signs or things that are already hazards.</li>
            <li>When something may cause you to change speed or direction, click once immediately.</li>
            <li>Optional second click 0.6–1.0s later as it continues to develop. A third is the edge of the habit.</li>
            <li>If you click through the whole clip, the DVSA algorithm will flag it and the clip scores zero.</li>
          </ol>
        </Card>
      ) : null}

      {finished ? (
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-3xl font-semibold uppercase tracking-wide">
              {scaled >= HAZARD_PASS ? "Above pass" : "Below 44"} · {scaled}/75
            </p>
            <p className="text-sm text-muted">Six compressed clips, scaled to the 13-clip / 75-point paper.</p>
          </div>
          <Button variant="secondary" onClick={resetAll}>
            <RotateCcw className="size-4" /> Reset clips
          </Button>
        </Card>
      ) : null}
    </div>
  );
}

function Timeline({
  clip,
  elapsed,
  clicks,
  showCoach,
}: {
  clip: HazardClip;
  elapsed: number;
  clicks: number[];
  showCoach: boolean;
}) {
  const marks = useMemo(() => {
    return clip.windows.map((w) => {
      const start = ((clip.hazardStartMs + w.from) / clip.durationMs) * 100;
      const width = ((w.to - w.from) / clip.durationMs) * 100;
      return { ...w, start, width };
    });
  }, [clip]);
  const playhead = (elapsed / clip.durationMs) * 100;
  const coachAt = ((clip.hazardStartMs + 400) / clip.durationMs) * 100;

  return (
    <div className="relative h-10 rounded-[var(--radius-sm)] bg-bg">
      {marks.map((m) => (
        <div
          key={m.points}
          className="absolute top-0 h-full"
          style={{
            left: `${m.start}%`,
            width: `${m.width}%`,
            background: `rgba(245, 158, 11, ${0.08 + m.points * 0.07})`,
          }}
        />
      ))}
      {showCoach ? (
        <div
          className="absolute top-1 h-8 w-0.5 bg-pass"
          style={{ left: `${coachAt}%` }}
          title="Suggested first click"
        />
      ) : null}
      {clicks.map((c) => (
        <div
          key={c}
          className="absolute top-1.5 size-2 rounded-full bg-fg"
          style={{ left: `${(c / clip.durationMs) * 100}%` }}
        />
      ))}
      <div
        className="absolute top-0 h-full w-0.5 bg-fg"
        style={{ left: `${playhead}%` }}
      />
      <div className="pointer-events-none absolute inset-x-2 top-1 flex justify-between text-[10px] uppercase tracking-[0.12em] text-subtle">
        <span>Scan</span>
        <span>5–1 window</span>
        <span>Too late</span>
      </div>
    </div>
  );
}

function RoadStage({
  clip,
  progress,
  inHazard,
}: {
  clip: HazardClip;
  progress: number;
  inHazard: boolean;
}) {
  const bike = 18 + progress * 54;
  const vanX = clip.hazardKind === "pullout" || clip.hazardKind === "junction" ? (inHazard ? 38 + (progress - 0.4) * 40 : 22) : 70;
  const pedY = clip.hazardKind === "pedestrian" ? (inHazard ? 48 : 22) : 22;
  const door = clip.hazardKind === "door" && inHazard ? 28 : 8;
  const lead = clip.hazardKind === "brake" ? (inHazard ? 58 : 72) : 64;
  const oncoming = clip.hazardKind === "oncoming" ? (inHazard ? 48 : 88) : 92;

  return (
    <svg viewBox="0 0 800 220" className="h-auto w-full bg-[#141416]" aria-hidden>
      <rect x="0" y="70" width="800" height="100" fill="#1c1c20" />
      <rect x="0" y="116" width="800" height="6" fill="#f4f4f5" opacity="0.35" />
      {[80, 200, 320, 440, 560, 680].map((x) => (
        <rect key={x} x={x} y="116" width="36" height="6" fill="#09090b" />
      ))}
      <rect x="0" y="70" width="800" height="8" fill="#27272c" />
      <rect x="0" y="162" width="800" height="8" fill="#27272c" />
      {/* parked cars */}
      <rect x="90" y="78" width="70" height="28" rx="6" fill="#27272c" />
      <rect x="190" y="78" width="70" height="28" rx="6" fill="#3f3f46" />
      <rect x="190" y="78" width={door} height="26" rx="3" fill="#f59e0b" opacity={clip.hazardKind === "door" ? 0.9 : 0} />
      {/* lead car */}
      <rect x={lead * 6} y="128" width="78" height="28" rx="6" fill="#a1a1aa" />
      {/* van / junction */}
      <rect x={vanX * 6} y={clip.hazardKind === "junction" ? 128 : 78} width="86" height="32" rx="5" fill="#d97706" opacity={0.9} />
      {/* pedestrian */}
      <circle cx="310" cy={220 - pedY * 2.2} r="7" fill="#f4f4f5" opacity={clip.hazardKind === "pedestrian" ? 1 : 0} />
      {/* oncoming */}
      <rect x={oncoming * 6} y="84" width="78" height="26" rx="6" fill="#fb7185" opacity={clip.hazardKind === "oncoming" ? 1 : 0.15} />
      {/* rider */}
      <g transform={`translate(${bike * 6} 132)`}>
        <circle cx="0" cy="18" r="9" fill="none" stroke="#f4f4f5" strokeWidth="3" />
        <circle cx="28" cy="18" r="9" fill="none" stroke="#f4f4f5" strokeWidth="3" />
        <path d="M8 18 L16 2 H30 L36 14 H18" fill="none" stroke="#f59e0b" strokeWidth="3" />
      </g>
      {inHazard ? (
        <text x="24" y="36" fill="#f59e0b" fontSize="14" fontFamily="IBM Plex Sans">
          DEVELOPING HAZARD
        </text>
      ) : (
        <text x="24" y="36" fill="#71717a" fontSize="14" fontFamily="IBM Plex Sans">
          SCAN — do not click yet
        </text>
      )}
    </svg>
  );
}
