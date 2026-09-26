import { useState } from "react";
import { ChevronDown, ShieldAlert, ShieldCheck } from "lucide-react";
import type { MockResult } from "@/lib/types";
import { DOMAIN_LABEL } from "@/lib/types";
import { Badge, Button, Card } from "@/components/ui";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { MOD1_MINOR_CAP, MOD2_MINOR_CAP, THEORY_PASS } from "@/lib/scoring";

export function Dl25Report({
  result,
  onAgain,
  onClose,
}: {
  result: MockResult;
  onAgain?: () => void;
  onClose: () => void;
}) {
  const pass = result.verdict === "PASS";
  const threshold =
    result.kind === "theory"
      ? `${THEORY_PASS}/50 multiple choice`
      : result.kind === "mod1"
        ? `0 serious/dangerous, ≤${MOD1_MINOR_CAP} rider faults`
        : result.kind === "mod2"
          ? `0 serious/dangerous, ≤${MOD2_MINOR_CAP} rider faults`
          : result.kind === "hazard"
            ? "44/75 hazard perception"
            : "weak-spot loop";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div
        className={cn(
          "rounded-[var(--radius-lg)] px-5 py-6 sm:px-8",
          pass ? "bg-pass text-pass-fg" : "bg-fail text-fail-fg",
        )}
      >
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] opacity-80">
          DVSA DL25-style debrief · {result.label}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-5xl font-semibold uppercase tracking-wide sm:text-6xl">
            {result.verdict}
          </h2>
          {pass ? <ShieldCheck className="size-10" /> : <ShieldAlert className="size-10" />}
        </div>
        <p className="mt-3 max-w-xl text-sm opacity-90">
          Threshold: {threshold}. This is a trainer reconstruction of the marking logic, not an official DL25.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-wide">Driving test report</p>
            <p className="text-sm text-muted">{formatDate(result.date)}</p>
          </div>
          <Badge tone={pass ? "pass" : "fail"}>Category A · DAS</Badge>
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat k="Score" v={`${result.score}/${result.maxScore}`} />
          <Stat k="Time" v={formatTime(result.durationSec)} />
          <Stat k="Dangerous" v={String(result.dangerous)} warn={result.dangerous > 0} />
          <Stat k="Serious" v={String(result.serious)} warn={result.serious > 0} />
        </dl>
        <div className="grid grid-cols-3 gap-2 rounded-[var(--radius-md)] bg-bg p-3">
          <FaultChip label="Dangerous" n={result.dangerous} hint="Actual danger — instant fail" />
          <FaultChip label="Serious" n={result.serious} hint="Potentially dangerous" />
          <FaultChip label="Rider (minor)" n={result.minor} hint="3 in one category = serious" />
        </div>
      </Card>

      <Card className="space-y-2">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-subtle">
          Deep-dive rationale
        </p>
        {result.answers.filter((a) => !a.correct).length === 0 ? (
          <p className="text-sm text-muted">No faults recorded. Keep the same process on the real pad.</p>
        ) : (
          result.answers
            .filter((a) => !a.correct)
            .map((a, i) => <Rationale key={`${a.id}-${i}`} a={a} />)
        )}
      </Card>

      <div className="flex flex-wrap gap-2">
        {onAgain ? (
          <Button onClick={onAgain}>Sit another</Button>
        ) : null}
        <Button variant="secondary" onClick={onClose}>
          Back
        </Button>
      </div>
    </div>
  );
}

function Stat({ k, v, warn }: { k: string; v: string; warn?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-subtle">{k}</dt>
      <dd className={cn("font-display text-2xl font-semibold tabular", warn && "text-fail")}>{v}</dd>
    </div>
  );
}

function FaultChip({ label, n, hint }: { label: string; n: number; hint: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-subtle">{label}</p>
      <p className="font-display text-xl font-semibold tabular">{n}</p>
      <p className="text-[11px] leading-snug text-subtle">{hint}</p>
    </div>
  );
}

function Rationale({ a }: { a: MockResult["answers"][number] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-[var(--radius-md)] bg-bg p-3">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={a.faultType === "Dangerous" ? "fail" : a.faultType === "Serious" ? "fail" : "warn"}>
              {a.faultType ?? "Fault"}
            </Badge>
            <span className="text-xs text-subtle">{DOMAIN_LABEL[a.domain]}</span>
          </div>
          <p className="mt-1 text-sm text-fg">{a.stem}</p>
        </div>
        <ChevronDown className={cn("mt-1 size-4 shrink-0 text-muted transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <dl className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-fail">The error</dt>
            <dd className="text-muted">Incorrect response recorded against this item.</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-pass">The DVSA expectation</dt>
            <dd className="text-fg">{a.rationale}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-subtle">Highway Code / standard</dt>
            <dd className="text-muted">{a.reference}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
