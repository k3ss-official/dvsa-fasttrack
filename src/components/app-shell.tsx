import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Archive,
  TrafficCone,
  ClipboardList,
  Eye,
  Gauge,
  Hammer,
  Layers,
  Menu,
  Route as RouteIcon,
  BookOpen,
  Settings,
  X,
  Zap,
} from "lucide-react";
import { ArchiveView } from "@/components/views/archive";
import { DrillView } from "@/components/views/drill";
import { GauntletView } from "@/components/views/gauntlet";
import { HazardView } from "@/components/views/hazard";
import { Mod1View } from "@/components/views/mod1";
import { Mod2View } from "@/components/views/mod2";
import { OneshotView } from "@/components/views/oneshot";
import { PipelineView } from "@/components/views/pipeline";
import { SettingsView } from "@/components/views/settings";
import { TheoryView } from "@/components/views/theory";
import { Button } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { type TabId } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRIMARY: { id: TabId; label: string; icon: typeof Gauge }[] = [
  { id: "pipeline", label: "Learn", icon: BookOpen },
  { id: "drill", label: "Drill", icon: Layers },
  { id: "oneshot", label: "Shot", icon: Zap },
  { id: "theory", label: "Mocks", icon: ClipboardList },
  { id: "gauntlet", label: "Weak", icon: Hammer },
];

const MORE: { id: TabId; label: string; icon: typeof Gauge }[] = [
  { id: "hazard", label: "Hazard cadence", icon: Eye },
  { id: "mod1", label: "Yard", icon: TrafficCone },
  { id: "mod2", label: "Road", icon: RouteIcon },
  { id: "archive", label: "Archive", icon: Archive },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AppShell() {
  const search = useSearch({ from: "/" });
  const tab: TabId = search.tab ?? "pipeline";
  const navigate = useNavigate({ from: "/" });
  const [more, setMore] = useState(false);

  function go(next: TabId) {
    setMore(false);
    void navigate({ search: { tab: next } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const view = (
    {
      pipeline: <PipelineView go={go} />,
      drill: <DrillView />,
      oneshot: <OneshotView />,
      theory: <TheoryView go={go} />,
      hazard: <HazardView />,
      mod1: <Mod1View />,
      mod2: <Mod2View />,
      gauntlet: <GauntletView />,
      archive: <ArchiveView />,
      settings: <SettingsView />,
    } satisfies Record<TabId, React.ReactNode>
  )[tab];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button type="button" onClick={() => go("pipeline")} className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-accent text-accent-fg">
              <Gauge className="size-4" />
            </span>
            <span className="text-left">
              <span className="block font-display text-lg font-semibold uppercase leading-none tracking-wide">
                FastTrack
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-subtle">
                UK motorcycle theory · 2026
              </span>
            </span>
          </button>
          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {[...PRIMARY, ...MORE].map((item) => (
              <NavBtn key={item.id} {...item} active={tab === item.id} onClick={() => go(item.id)} />
            ))}
          </nav>
          <div className="ml-auto lg:hidden">
            <Button variant="ghost" size="icon" aria-label="More" onClick={() => setMore((v) => !v)}>
              {more ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
        {more ? (
          <div className="border-t border-border px-4 py-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {[...PRIMARY, ...MORE].map((item) => (
                <NavBtn key={item.id} {...item} active={tab === item.id} onClick={() => go(item.id)} wide />
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-28 lg:pb-10">{view}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden">
        <ul className="grid grid-cols-5">
          {PRIMARY.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => go(item.id)}
                className={cn(
                  "flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px]",
                  tab === item.id ? "text-accent" : "text-muted",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function NavBtn({
  label,
  icon: Icon,
  active,
  onClick,
  wide,
}: {
  id: TabId;
  label: string;
  icon: typeof Gauge;
  active: boolean;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-[var(--radius-md)] px-3 text-sm",
        wide && "w-full justify-start",
        active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

export function HydrateGate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const maybe = useAppStore.persist.rehydrate();
    void Promise.resolve(maybe).then(() => {
      useAppStore.getState().setHydrated(true);
    });
  }, []);
  return children;
}
