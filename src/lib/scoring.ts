import { ALL_THEORY, CASES } from "@/data/theory";
import { FACTS as FACT_BANK, FACT_QUESTIONS as FQ, TOPICS as TOPIC_LIST } from "@/data/facts";
import { MOD1_PROMPTS } from "@/data/mod1";
import { MOD2_SCENARIOS } from "@/data/mod2";
import type {
  AnswerRecord,
  Fact,
  FaultType,
  HeatmapBucket,
  LedgerItem,
  MockKind,
  MockResult,
  TheoryQuestion,
  TopicId,
} from "@/lib/types";
import { HEATMAP_META } from "@/lib/types";
import { mulberry32, shuffle, uid } from "@/lib/utils";

export const THEORY_PASS = 43;
export const THEORY_TOTAL = 50;
export const THEORY_SECONDS = 57 * 60;
export const HAZARD_PASS = 44;
export const HAZARD_TOTAL = 75;
export const MOD1_MINOR_CAP = 5;
export const MOD2_MINOR_CAP = 10;

export const QUESTION_BANK: TheoryQuestion[] = [...FQ, ...ALL_THEORY];

export { FACT_BANK, TOPIC_LIST, FQ };

export function speedTrap(kmh: number): {
  mph: number;
  band: "fail" | "minor" | "pass";
  label: string;
  detail: string;
} {
  const mph = kmh * 0.621371;
  if (kmh + 1e-6 < 48) {
    return {
      mph,
      band: "fail",
      label: kmh <= 47 ? "Repeat + rider fault" : "Under speed",
      detail:
        "DT1: 47 km/h or less is a rider fault and a repeat if the stop was otherwise safe. Miss the minimum on the repeat and the exercise fails.",
    };
  }
  if (kmh < 50) {
    return {
      mph,
      band: "minor",
      label: "Rider fault — 48–49 km/h",
      detail:
        "DT1: 48 or 49 km/h is a rider fault. The examiner will not ask for a speed-only repeat. 50 km/h is the clean figure for A/A2.",
    };
  }
  return {
    mph,
    band: "pass",
    label: "Clean speed",
    detail: "At or above 50 km/h (about 32 mph). Build a couple of km/h of margin so a gust does not dump you into 49.",
  };
}

export function generateTheoryPaper(seed: number): TheoryQuestion[] {
  const rng = mulberry32(seed);
  const study = CASES[Math.floor(rng() * CASES.length)]!;
  const caseQs = study.questionIds
    .map((id) => QUESTION_BANK.find((q) => q.id === id) ?? ALL_THEORY.find((q) => q.id === id))
    .filter((q): q is TheoryQuestion => Boolean(q));
  const used = new Set(caseQs.map((q) => q.id));
  const facts = shuffle(
    FQ.filter((q) => !used.has(q.id)),
    rng,
  );
  const extra = shuffle(
    ALL_THEORY.filter((q) => !q.caseStudyId && !used.has(q.id)),
    rng,
  );
  const need = THEORY_TOTAL - caseQs.length;
  const fromFacts = facts.slice(0, Math.min(36, need));
  const rest = extra.slice(0, Math.max(0, need - fromFacts.length));
  return shuffle([...fromFacts, ...rest, ...caseQs], rng);
}

export function generateMod1Paper(seed: number) {
  const rng = mulberry32(seed);
  return shuffle(MOD1_PROMPTS, rng).slice(0, 8);
}

export function generateMod2Paper(seed: number) {
  const rng = mulberry32(seed);
  return shuffle(MOD2_SCENARIOS, rng).slice(0, 25);
}

export function oneshotDeck(topic?: TopicId, n = 12) {
  const pool = topic ? FACT_BANK.filter((f) => f.topic === topic) : FACT_BANK;
  return shuffle(pool).slice(0, Math.min(n, pool.length));
}

export function drawFact(exclude: string[] = [], topic?: TopicId): Fact {
  const base = topic ? FACT_BANK.filter((f) => f.topic === topic) : FACT_BANK;
  const pool = base.filter((f) => !exclude.includes(f.id));
  const src = pool.length ? pool : base.length ? base : FACT_BANK;
  return src[Math.floor(Math.random() * src.length)]!;
}

function rankFact(id: string, ledger: Record<string, LedgerItem>, studied: Record<string, string>) {
  const item = ledger[id];
  if (item?.status === "weak") return 0;
  if (!studied[id]) return 1;
  if (item?.status === "learning") return 2;
  if (!item || item.status === "unseen") return 3;
  return 4;
}

export function trailingDeck(
  ledger: Record<string, LedgerItem>,
  studied: Record<string, string>,
  n = 16,
  topic?: TopicId,
): Fact[] {
  const pool = topic ? FACT_BANK.filter((f) => f.topic === topic) : FACT_BANK;
  const ranked = pool.slice().sort((a, b) => rankFact(a.id, ledger, studied) - rankFact(b.id, ledger, studied));
  return ranked.slice(0, Math.min(n, ranked.length));
}

export function numberBank(topic?: TopicId) {
  return FACT_BANK.filter((f) => f.number && (!topic || f.topic === topic));
}

export function shuffleChoices(options: [string, string, string, string], correctIndex: number) {
  const tagged = options.map((text, i) => ({ text, ok: i === correctIndex }));
  const mixed = shuffle(tagged);
  const nextIndex = mixed.findIndex((t) => t.ok);
  return {
    options: [mixed[0]!.text, mixed[1]!.text, mixed[2]!.text, mixed[3]!.text] as [
      string,
      string,
      string,
      string,
    ],
    correctIndex: (nextIndex < 0 ? 0 : nextIndex) as 0 | 1 | 2 | 3,
  };
}

export function gauntletPool(ledger: Record<string, LedgerItem>) {
  const ids = Object.values(ledger)
    .filter((i) => i.status === "weak" || i.status === "learning")
    .map((i) => i.id);
  const byId = new Map<
    string,
    {
      id: string;
      kind: "theory" | "mod1" | "mod2";
      stem: string;
      options: [string, string, string, string];
      correctIndex: number;
      rationale: string;
      reference: string;
      domain: LedgerItem["domain"];
      faultIfWrong: FaultType;
    }
  >();
  for (const q of QUESTION_BANK) {
    byId.set(q.id, {
      id: q.id,
      kind: "theory",
      stem: q.stem,
      options: q.options,
      correctIndex: q.correctIndex,
      rationale: q.rationale,
      reference: q.reference,
      domain: q.domain,
      faultIfWrong: q.faultIfWrong,
    });
  }
  for (const q of MOD1_PROMPTS) {
    byId.set(q.id, {
      id: q.id,
      kind: "mod1",
      stem: q.prompt,
      options: q.options,
      correctIndex: q.correctIndex,
      rationale: q.rationale,
      reference: q.reference,
      domain: q.domain,
      faultIfWrong: q.faultIfWrong,
    });
  }
  for (const q of MOD2_SCENARIOS) {
    byId.set(q.id, {
      id: q.id,
      kind: "mod2",
      stem: q.situation + " — " + q.title,
      options: q.options,
      correctIndex: q.correctIndex,
      rationale: q.rationale,
      reference: q.reference,
      domain: q.domain,
      faultIfWrong: q.faultIfWrong,
    });
  }
  const factsFirst = ids
    .map((id) => byId.get(id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .sort((a, b) => Number(a.kind !== "theory") - Number(b.kind !== "theory"));
  return shuffle(factsFirst);
}

export function applyAnswer(
  item: LedgerItem,
  correct: boolean,
  sessionId: string,
  fault: FaultType | null,
): LedgerItem {
  const next: LedgerItem = {
    ...item,
    timesEncountered: item.timesEncountered + 1,
  };
  if (correct) {
    if (item.lastCorrectSession !== sessionId) {
      next.consecutiveCorrect = item.consecutiveCorrect + 1;
      next.lastCorrectSession = sessionId;
    }
    next.lastFaultType = null;
    next.status = next.consecutiveCorrect >= 3 ? "mastered" : "learning";
  } else {
    next.consecutiveCorrect = 0;
    next.status = "weak";
    next.lastFaultType = fault;
  }
  return next;
}

export function tallyFaults(answers: AnswerRecord[]) {
  let dangerous = 0;
  let serious = 0;
  let minor = 0;
  const byCat: Record<string, number> = {};
  for (const a of answers) {
    if (a.correct || !a.faultType) continue;
    if (a.faultType === "Dangerous") dangerous += 1;
    else if (a.faultType === "Serious") serious += 1;
    else {
      minor += 1;
      const key = a.domain;
      byCat[key] = (byCat[key] ?? 0) + 1;
      if (byCat[key] === 3) {
        minor -= 3;
        serious += 1;
      }
    }
  }
  return { dangerous, serious, minor };
}

export function verdictFor(
  kind: MockKind,
  score: number,
  max: number,
  faults: { dangerous: number; serious: number; minor: number },
): "PASS" | "FAIL" {
  if (kind === "theory" || kind === "gauntlet" || kind === "oneshot" || kind === "drill") {
    if (max === THEORY_TOTAL) return score >= THEORY_PASS ? "PASS" : "FAIL";
    return score / Math.max(max, 1) >= 0.8 ? "PASS" : "FAIL";
  }
  if (kind === "hazard") return score >= HAZARD_PASS ? "PASS" : "FAIL";
  if (faults.dangerous > 0 || faults.serious > 0) return "FAIL";
  if (kind === "mod1") return faults.minor <= MOD1_MINOR_CAP ? "PASS" : "FAIL";
  if (kind === "mod2") return faults.minor <= MOD2_MINOR_CAP ? "PASS" : "FAIL";
  return "FAIL";
}

export function buildMock(opts: {
  kind: MockKind;
  label: string;
  answers: AnswerRecord[];
  durationSec: number;
  score: number;
  maxScore: number;
}): MockResult {
  const faults = tallyFaults(opts.answers);
  return {
    id: uid("mock"),
    kind: opts.kind,
    label: opts.label,
    date: new Date().toISOString(),
    score: opts.score,
    maxScore: opts.maxScore,
    verdict: verdictFor(opts.kind, opts.score, opts.maxScore, faults),
    durationSec: opts.durationSec,
    dangerous: faults.dangerous,
    serious: faults.serious,
    minor: faults.minor,
    answers: opts.answers,
  };
}

export function heatmapScores(ledger: Record<string, LedgerItem>): Record<HeatmapBucket, number> {
  const out = {} as Record<HeatmapBucket, number>;
  for (const bucket of HEATMAP_META) {
    const items = Object.values(ledger).filter((i) => bucket.domains.includes(i.domain));
    if (!items.length) {
      out[bucket.id] = 0;
      continue;
    }
    const pts = items.reduce((sum, i) => {
      if (i.status === "mastered") return sum + 1;
      if (i.status === "learning") return sum + 0.45;
      if (i.status === "weak") return sum + 0.12;
      return sum;
    }, 0);
    out[bucket.id] = Math.round((pts / items.length) * 100);
  }
  return out;
}

export function topicProgress(
  ledger: Record<string, LedgerItem>,
  studied: Record<string, string>,
): Record<TopicId, { studied: number; mastered: number; weak: number; total: number; pct: number }> {
  const out = {} as Record<
    TopicId,
    { studied: number; mastered: number; weak: number; total: number; pct: number }
  >;
  for (const t of TOPIC_LIST) {
    const facts = FACT_BANK.filter((f) => f.topic === t.id);
    const total = facts.length;
    let studiedN = 0;
    let mastered = 0;
    let weak = 0;
    for (const f of facts) {
      if (studied[f.id]) studiedN += 1;
      const item = ledger[f.id];
      if (item?.status === "mastered") mastered += 1;
      if (item?.status === "weak") weak += 1;
    }
    const pct = total ? Math.round(((studiedN * 0.4 + mastered * 0.6) / total) * 100) : 0;
    out[t.id] = { studied: studiedN, mastered, weak, total, pct: Math.min(100, pct) };
  }
  return out;
}

export function readinessPercent(input: {
  ledger: Record<string, LedgerItem>;
  studiedFacts: Record<string, string>;
  theoryPassed: boolean;
  hazardBest: number;
}) {
  const tp = topicProgress(input.ledger, input.studiedFacts);
  const avg = TOPIC_LIST.reduce((s, t) => s + tp[t.id]!.pct, 0) / Math.max(TOPIC_LIST.length, 1);
  const studiedN = Object.keys(input.studiedFacts).length;
  const studiedPct = (studiedN / Math.max(FACT_BANK.length, 1)) * 100;
  const flags =
    (input.theoryPassed ? 10 : 0) + Math.min(8, (input.hazardBest / HAZARD_TOTAL) * 8);
  return Math.max(0, Math.min(100, Math.round(studiedPct * 0.35 + avg * 0.55 + flags)));
}

export function mockSeed(kind: "theory" | "mod1" | "mod2", n: number | "random") {
  if (n === "random") return (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
  const base = kind === "theory" ? 1100 : kind === "mod1" ? 2200 : 3300;
  return base + n;
}
