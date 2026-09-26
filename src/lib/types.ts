export type TabId =
  | "pipeline"
  | "drill"
  | "oneshot"
  | "theory"
  | "hazard"
  | "mod1"
  | "mod2"
  | "gauntlet"
  | "archive"
  | "settings";

export const TABS: TabId[] = [
  "pipeline",
  "drill",
  "oneshot",
  "theory",
  "hazard",
  "mod1",
  "mod2",
  "gauntlet",
  "archive",
  "settings",
];

export type TopicId =
  | "alertness"
  | "attitude"
  | "safety_machine"
  | "safety_margins"
  | "hazard"
  | "vulnerable"
  | "other_vehicles"
  | "handling"
  | "motorway"
  | "rules"
  | "signs"
  | "documents"
  | "incidents"
  | "loading";

export type DomainId =
  | "Road_Signs"
  | "Hierarchy_Road_Users"
  | "Speed_Limits"
  | "Bus_Lanes"
  | "CPR_AED"
  | "Legal_Equipment"
  | "Separation_Distance"
  | "Mod1_Maneuvers"
  | "Mod2_Junctions"
  | "Mod2_Observation"
  | "Filtering"
  | "Alertness"
  | "Motorway_Rules"
  | "Documents"
  | "Loading"
  | "Hazard_Awareness"
  | "Vehicle_Handling";

export type HeatmapBucket =
  | "signs"
  | "vulnerable"
  | "speed"
  | "mod1"
  | "mod2"
  | "firstaid";

export type ItemStatus = "unseen" | "weak" | "learning" | "mastered";
export type FaultType = "Dangerous" | "Serious" | "Minor";
export type MockKind = "theory" | "mod1" | "mod2" | "hazard" | "gauntlet" | "oneshot" | "drill";

export interface LedgerItem {
  id: string;
  domain: DomainId;
  timesEncountered: number;
  consecutiveCorrect: number;
  status: ItemStatus;
  lastFaultType: FaultType | null;
  lastCorrectSession: string | null;
}

export interface Fact {
  id: string;
  topic: TopicId;
  domain: DomainId;
  title: string;
  teach: string;
  trap: string;
  reference: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  rationale: string;
  faultIfWrong: FaultType;
  tf: { statement: string; answer: boolean };
  number?: { ask: string; correct: string; decoys: [string, string, string] };
}

export interface TheoryQuestion {
  id: string;
  domain: DomainId;
  stem: string;
  scenario?: string;
  caseStudyId?: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  rationale: string;
  reference: string;
  faultIfWrong: FaultType;
}

export interface CaseStudy {
  id: string;
  title: string;
  narrative: string;
  questionIds: string[];
}

export interface ScenarioQuestion {
  id: string;
  domain: DomainId;
  title: string;
  situation: string;
  visual: "t-junction" | "roundabout" | "mini-roundabout" | "spiral" | "filter" | "blind" | "satnav" | "lifesaver" | "position" | "crossroads";
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  rationale: string;
  reference: string;
  faultIfWrong: FaultType;
  dl25Category: string;
}

export interface ShowMeTellMe {
  id: string;
  kind: "tell" | "show";
  prompt: string;
  answer: string;
  reference: string;
  domain: DomainId;
}

export interface Mod1Exercise {
  id: string;
  step: number;
  name: string;
  brief: string;
  how: string[];
  passCriteria: string[];
  failModes: { text: string; fault: FaultType }[];
  reference: string;
}

export interface Mod1Prompt {
  id: string;
  exerciseId: string;
  domain: DomainId;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  rationale: string;
  reference: string;
  faultIfWrong: FaultType;
}

export interface HazardClip {
  id: string;
  title: string;
  durationMs: number;
  hazardStartMs: number;
  windows: { from: number; to: number; points: number }[];
  cheatClicks: number;
  beats: { at: number; label: string }[];
  hazardKind: "pullout" | "pedestrian" | "door" | "brake" | "oncoming" | "junction";
}

export interface AnswerRecord {
  id: string;
  correct: boolean;
  chosen: number | null;
  faultType: FaultType | null;
  stem: string;
  rationale: string;
  reference: string;
  domain: DomainId;
  flagged?: boolean;
}

export interface MockResult {
  id: string;
  kind: MockKind;
  label: string;
  date: string;
  score: number;
  maxScore: number;
  verdict: "PASS" | "FAIL";
  durationSec: number;
  dangerous: number;
  serious: number;
  minor: number;
  answers: AnswerRecord[];
}

export interface CbtLog {
  completed: boolean;
  date: string;
  notes: string;
}

export interface AppStateShape {
  ledger: Record<string, LedgerItem>;
  mocks: MockResult[];
  checklists: Record<string, boolean>;
  flagged: string[];
  studiedFacts: Record<string, string>;
  testDate: string;
  cbt: CbtLog;
  theoryPassed: boolean;
  mod1Passed: boolean;
  mod2Passed: boolean;
  hazardBest: number;
  sound: boolean;
}

export const HEATMAP_META: {
  id: HeatmapBucket;
  label: string;
  domains: DomainId[];
}[] = [
  {
    id: "signs",
    label: "Road Signs & Markings",
    domains: ["Road_Signs"],
  },
  {
    id: "vulnerable",
    label: "Vulnerable Road Users",
    domains: ["Hierarchy_Road_Users", "Mod2_Junctions"],
  },
  {
    id: "speed",
    label: "Speed & Separation",
    domains: ["Speed_Limits", "Separation_Distance", "Bus_Lanes", "Filtering"],
  },
  {
    id: "mod1",
    label: "Mod 1 Slow Control",
    domains: ["Mod1_Maneuvers", "Vehicle_Handling"],
  },
  {
    id: "mod2",
    label: "Mod 2 Observation",
    domains: ["Mod2_Observation", "Legal_Equipment", "Alertness"],
  },
  {
    id: "firstaid",
    label: "First Aid, CPR & AED",
    domains: ["CPR_AED"],
  },
];

export const DOMAIN_LABEL: Record<DomainId, string> = {
  Road_Signs: "Road signs",
  Hierarchy_Road_Users: "Hierarchy of road users",
  Speed_Limits: "Speed limits",
  Bus_Lanes: "Bus lanes",
  CPR_AED: "CPR & AED",
  Legal_Equipment: "Legal & equipment",
  Separation_Distance: "Separation distances",
  Mod1_Maneuvers: "Module 1 manoeuvres",
  Mod2_Junctions: "Junctions",
  Mod2_Observation: "Observation & lifesavers",
  Filtering: "Filtering",
  Alertness: "Alertness",
  Motorway_Rules: "Motorway rules",
  Documents: "Documents",
  Loading: "Loading",
  Hazard_Awareness: "Hazard awareness",
  Vehicle_Handling: "Motorcycle handling",
};
