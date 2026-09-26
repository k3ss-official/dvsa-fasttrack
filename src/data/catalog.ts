import type { DomainId, LedgerItem } from "@/lib/types";
import { FACTS } from "@/data/facts";
import { ALL_THEORY } from "@/data/theory";
import { MOD1_PROMPTS } from "@/data/mod1";
import { MOD2_SCENARIOS } from "@/data/mod2";
import { SHOW_ME_TELL_ME } from "@/data/show-me";

export interface CatalogItem {
  id: string;
  domain: DomainId;
}

export const CATALOG: CatalogItem[] = [
  ...FACTS.map((q) => ({ id: q.id, domain: q.domain })),
  ...ALL_THEORY.map((q) => ({ id: q.id, domain: q.domain })),
  ...MOD1_PROMPTS.map((q) => ({ id: q.id, domain: q.domain })),
  ...MOD2_SCENARIOS.map((q) => ({ id: q.id, domain: q.domain })),
  ...SHOW_ME_TELL_ME.map((q) => ({ id: q.id, domain: q.domain })),
];

export const CATALOG_BY_ID = new Map(CATALOG.map((c) => [c.id, c]));

export function emptyLedgerItem(id: string, domain: DomainId): LedgerItem {
  return {
    id,
    domain,
    timesEncountered: 0,
    consecutiveCorrect: 0,
    status: "unseen",
    lastFaultType: null,
    lastCorrectSession: null,
  };
}

export function seedLedger(): Record<string, LedgerItem> {
  const out: Record<string, LedgerItem> = {};
  for (const item of CATALOG) {
    out[item.id] = emptyLedgerItem(item.id, item.domain);
  }
  return out;
}
