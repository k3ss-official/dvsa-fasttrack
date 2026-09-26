import { useMemo, useState } from "react";
import { Badge, Button, Card, SectionLabel } from "@/components/ui";
import { Dl25Report } from "@/components/debrief";
import { useAppStore } from "@/lib/store";
import type { MockKind, MockResult } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const FILTERS: { id: "all" | MockKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "theory", label: "Mocks" },
  { id: "oneshot", label: "One-shot" },
  { id: "drill", label: "Drill" },
  { id: "gauntlet", label: "Weak" },
  { id: "hazard", label: "Hazard" },
  { id: "mod1", label: "Yard" },
  { id: "mod2", label: "Road" },
];

export function ArchiveView() {
  const mocks = useAppStore((s) => s.mocks);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [open, setOpen] = useState<MockResult | null>(null);
  const rows = useMemo(
    () => mocks.filter((m) => (filter === "all" ? true : m.kind === filter)),
    [mocks, filter],
  );

  if (open) {
    return <Dl25Report result={open} onClose={() => setOpen(null)} />;
  }

  return (
    <div className="space-y-6">
      <header>
        <SectionLabel>Test archive</SectionLabel>
        <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide">Papers sat</h1>
      </header>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button key={f.id} size="sm" variant={filter === f.id ? "primary" : "secondary"} onClick={() => setFilter(f.id)}>
            {f.label}
          </Button>
        ))}
      </div>
      {rows.length ? (
        <ul className="space-y-2">
          {rows.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setOpen(m)}
                className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface px-4 py-3 text-left shadow-[var(--shadow-border)]"
              >
                <span>
                  <span className="block text-sm font-medium">{m.label}</span>
                  <span className="block text-xs text-subtle">{formatDate(m.date)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-sm tabular">
                    {m.score}/{m.maxScore}
                  </span>
                  <Badge tone={m.verdict === "PASS" ? "pass" : "fail"}>{m.verdict}</Badge>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <p className="text-sm text-muted">No papers in this filter yet. Learn, drill, then sit a mock.</p>
        </Card>
      )}
    </div>
  );
}
