import { Volume2, VolumeX } from "lucide-react";
import { Button, Card, SectionLabel } from "@/components/ui";
import { CBT_CHECKS } from "@/data/checklists";
import { haptic } from "@/lib/audio";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const testDate = useAppStore((s) => s.testDate);
  const setTestDate = useAppStore((s) => s.setTestDate);
  const cbt = useAppStore((s) => s.cbt);
  const setCbt = useAppStore((s) => s.setCbt);
  const sound = useAppStore((s) => s.sound);
  const setSound = useAppStore((s) => s.setSound);
  const checklists = useAppStore((s) => s.checklists);
  const toggle = useAppStore((s) => s.toggleChecklist);
  const resetLedger = useAppStore((s) => s.resetLedger);
  const resetAll = useAppStore((s) => s.resetAll);

  return (
    <div className="space-y-6">
      <header>
        <SectionLabel>Settings</SectionLabel>
        <h1 className="mt-1 font-display text-4xl font-semibold uppercase tracking-wide">Candidate log</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Test date, CBT, and this device’s ledger. Resetting the ledger forgets studied facts and weak spots.
        </p>
      </header>

      <Card className="space-y-4">
        <SectionLabel>Test date</SectionLabel>
        <input
          type="date"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
          className="h-11 w-full max-w-xs rounded-[var(--radius-md)] bg-bg px-3 text-fg shadow-[var(--shadow-border)]"
        />
        <p className="text-xs text-subtle">Used only for the dashboard countdown. Stored on this device.</p>
      </Card>

      <Card className="space-y-3">
        <SectionLabel>CBT · DL196</SectionLabel>
        {CBT_CHECKS.map((c) => (
          <label key={c.id} className="flex min-h-12 items-start gap-3 rounded-[var(--radius-md)] bg-bg px-3 py-3">
            <input
              type="checkbox"
              checked={c.id === "cbt_done" ? cbt.completed : Boolean(checklists[c.id])}
              onChange={() => {
                if (c.id === "cbt_done") setCbt({ completed: !cbt.completed });
                else toggle(c.id);
                haptic("tap", sound);
              }}
              className="mt-1 size-4 accent-accent"
            />
            <span>
              <span className="block text-sm font-medium">{c.label}</span>
              <span className="text-xs text-muted">{c.detail}</span>
            </span>
          </label>
        ))}
        <label className="block">
          <span className="text-xs uppercase tracking-[0.14em] text-subtle">Certificate date</span>
          <input
            type="date"
            value={cbt.date}
            onChange={(e) => setCbt({ date: e.target.value })}
            className="mt-2 h-11 w-full max-w-xs rounded-[var(--radius-md)] bg-bg px-3 text-fg shadow-[var(--shadow-border)]"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.14em] text-subtle">Notes</span>
          <textarea
            value={cbt.notes}
            onChange={(e) => setCbt({ notes: e.target.value })}
            rows={3}
            className="mt-2 w-full rounded-[var(--radius-md)] bg-bg px-3 py-2 text-sm text-fg shadow-[var(--shadow-border)]"
            placeholder="School, bike, restrictions…"
          />
        </label>
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">Audio / haptic cues</p>
          <p className="text-sm text-muted">Short tones and vibration on answers and checklist taps.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setSound(!sound);
            haptic("tap", true);
          }}
        >
          {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          {sound ? "On" : "Off"}
        </Button>
      </Card>

      <Card className="space-y-3">
        <SectionLabel>Data</SectionLabel>
        <p className="text-sm text-muted">Everything lives in this browser’s localStorage. Nothing is uploaded.</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              if (window.confirm("Reset the weakness ledger? Mock archive and CBT log stay.")) resetLedger();
            }}
          >
            Reset weakness ledger
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm("Erase all FastTrack data on this device?")) resetAll();
            }}
          >
            Reset all data
          </Button>
        </div>
      </Card>

      <p className={cn("text-xs text-subtle")}>
        FastTrack is a training aid. Marking rules follow published DVSA / Highway Code / Resuscitation Council UK
        material. It is not an official test, and a pass here is not a licence.
      </p>
    </div>
  );
}
