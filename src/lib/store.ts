import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { seedLedger } from "@/data/catalog";
import { CATALOG_BY_ID, emptyLedgerItem } from "@/data/catalog";
import { applyAnswer } from "@/lib/scoring";
import type {
  AppStateShape,
  CbtLog,
  FaultType,
  LedgerItem,
  MockResult,
} from "@/lib/types";

const emptyCbt = (): CbtLog => ({ completed: false, date: "", notes: "" });

function mergeLedger(saved?: Record<string, LedgerItem>) {
  const seeded = seedLedger();
  if (!saved) return seeded;
  for (const [id, item] of Object.entries(saved)) {
    if (seeded[id]) {
      seeded[id] = { ...seeded[id], ...item, id, domain: seeded[id].domain };
    }
  }
  return seeded;
}

export interface AppStore extends AppStateShape {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  recordAnswer: (opts: {
    id: string;
    correct: boolean;
    sessionId: string;
    fault: FaultType | null;
  }) => void;
  saveMock: (mock: MockResult) => void;
  toggleChecklist: (id: string) => void;
  toggleFlag: (id: string) => void;
  markStudied: (id: string) => void;
  setTestDate: (iso: string) => void;
  setCbt: (cbt: Partial<CbtLog>) => void;
  setSound: (on: boolean) => void;
  setHazardBest: (n: number) => void;
  resetLedger: () => void;
  resetAll: () => void;
}

const initial = (): AppStateShape => ({
  ledger: seedLedger(),
  mocks: [],
  checklists: {},
  flagged: [],
  studiedFacts: {},
  testDate: "",
  cbt: emptyCbt(),
  theoryPassed: false,
  mod1Passed: false,
  mod2Passed: false,
  hazardBest: 0,
  sound: true,
});

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initial(),
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      recordAnswer: ({ id, correct, sessionId, fault }) => {
        const catalog = CATALOG_BY_ID.get(id);
        const current =
          get().ledger[id] ??
          (catalog ? emptyLedgerItem(id, catalog.domain) : null);
        if (!current) return;
        const next = applyAnswer(current, correct, sessionId, fault);
        set({ ledger: { ...get().ledger, [id]: next } });
      },
      saveMock: (mock) => {
        const patch: Partial<AppStateShape> = {
          mocks: [mock, ...get().mocks].slice(0, 40),
        };
        if (mock.kind === "theory" && mock.verdict === "PASS") patch.theoryPassed = true;
        if (mock.kind === "mod1" && mock.verdict === "PASS") patch.mod1Passed = true;
        if (mock.kind === "mod2" && mock.verdict === "PASS") patch.mod2Passed = true;
        set(patch);
      },
      toggleChecklist: (id) => {
        const checklists = { ...get().checklists, [id]: !get().checklists[id] };
        set({ checklists });
      },
      toggleFlag: (id) => {
        const flagged = get().flagged.includes(id)
          ? get().flagged.filter((x) => x !== id)
          : [...get().flagged, id];
        set({ flagged });
      },
      markStudied: (id) => {
        set({ studiedFacts: { ...get().studiedFacts, [id]: new Date().toISOString() } });
      },
      setTestDate: (iso) => set({ testDate: iso }),
      setCbt: (cbt) => set({ cbt: { ...get().cbt, ...cbt } }),
      setSound: (on) => set({ sound: on }),
      setHazardBest: (n) => set({ hazardBest: Math.max(get().hazardBest, n) }),
      resetLedger: () =>
        set({
          ledger: seedLedger(),
          studiedFacts: {},
          theoryPassed: false,
          mod1Passed: false,
          mod2Passed: false,
          hazardBest: 0,
        }),
      resetAll: () => set({ ...initial(), hydrated: true }),
    }),
    {
      name: "dvsa-fasttrack-v2",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        ledger: s.ledger,
        mocks: s.mocks,
        checklists: s.checklists,
        flagged: s.flagged,
        studiedFacts: s.studiedFacts,
        testDate: s.testDate,
        cbt: s.cbt,
        theoryPassed: s.theoryPassed,
        mod1Passed: s.mod1Passed,
        mod2Passed: s.mod2Passed,
        hazardBest: s.hazardBest,
        sound: s.sound,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppStateShape>;
        return {
          ...current,
          ...p,
          ledger: mergeLedger(p.ledger),
          mocks: p.mocks ?? [],
          checklists: p.checklists ?? {},
          flagged: p.flagged ?? [],
          studiedFacts: p.studiedFacts ?? {},
          cbt: { ...emptyCbt(), ...(p.cbt ?? {}) },
        };
      },
    },
  ),
);
