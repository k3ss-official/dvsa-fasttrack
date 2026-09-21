import { createFileRoute } from "@tanstack/react-router";
import { AppShell, HydrateGate } from "@/components/app-shell";
import { TABS, type TabId } from "@/lib/types";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { tab?: TabId } => {
    const raw = typeof search.tab === "string" ? search.tab : undefined;
    if (raw && (TABS as string[]).includes(raw)) return { tab: raw as TabId };
    return {};
  },
  component: Home,
});

function Home() {
  return (
    <HydrateGate>
      <AppShell />
    </HydrateGate>
  );
}
