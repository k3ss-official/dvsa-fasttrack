export interface ChecklistItem {
  id: string;
  group: string;
  label: string;
  detail: string;
}

export const MOD2_TRAPS: ChecklistItem[] = [
  {
    id: "trap_life_move",
    group: "Lifesaver protocol",
    label: "Lifesaver every move-off",
    detail: "Right shoulder before the bike occupies the live lane. Mirrors lie when a van is behind you.",
  },
  {
    id: "trap_life_exit",
    group: "Lifesaver protocol",
    label: "Exit lifesaver on every roundabout",
    detail: "Peeling off without a look into the left (or right, if you are in the inside lane) is a standard serious.",
  },
  {
    id: "trap_life_lane",
    group: "Lifesaver protocol",
    label: "Lifesaver before every lane change",
    detail: "Signal is not a force field. The last act is the look into the hole you want.",
  },
  {
    id: "trap_life_turn",
    group: "Lifesaver protocol",
    label: "Shoulder check before left and right turns",
    detail: "Cyclists and filters live in the blind cone. H3 plus a lifesaver is the pair.",
  },
  {
    id: "trap_pos_gutter",
    group: "Dominant positioning",
    label: "Out of the gutter",
    detail: "Left wheel track as default. Drain covers and diesel are not a racing line.",
  },
  {
    id: "trap_pos_white",
    group: "Dominant positioning",
    label: "Do not live on the white line",
    detail: "Take a commanding position to see, then give it back. Do not clip oncoming traffic.",
  },
  {
    id: "trap_pos_parked",
    group: "Dominant positioning",
    label: "Space for doors and feet",
    detail: "Move out early for parked vehicles. Look for drivers and pedestrians, not just metal.",
  },
  {
    id: "trap_pos_command",
    group: "Dominant positioning",
    label: "Commanding position at hazards",
    detail: "Be seen from side roads. A bike in the kerb is invisible behind a hedge.",
  },
  {
    id: "trap_mini_disc",
    group: "Mini-roundabouts",
    label: "Pass around the painted disc",
    detail: "Straight-lining is the veteran fail. Give way to the right, go around.",
  },
  {
    id: "trap_mini_signal",
    group: "Mini-roundabouts",
    label: "Signals still apply",
    detail: "Right turns need a right signal. Left on exit if it will not mislead.",
  },
  {
    id: "trap_mini_speed",
    group: "Mini-roundabouts",
    label: "Do not treat it as a bend",
    detail: "If you have to brake on the disc because someone emerged, you arrived too fast.",
  },
  {
    id: "trap_sat_no_panic",
    group: "Independent riding",
    label: "Missed turn: continue safely",
    detail: "No U-turn, no stop in the live lane, no pavement. Next safe recovery.",
  },
  {
    id: "trap_sat_eyes",
    group: "Independent riding",
    label: "Ride the road, not the glass",
    detail: "A glance at the unit, then eyes up. Three stares is an observation fault.",
  },
  {
    id: "trap_sat_signs",
    group: "Independent riding",
    label: "Follow the signs if the unit dies",
    detail: "Independent riding is also a follow-signs brief. Dead sat-nav is not a pause in the test.",
  },
  {
    id: "trap_h2",
    group: "2022 hierarchy",
    label: "H2 — pedestrians waiting to cross",
    detail: "Turning into or out of a side road: waiting pedestrians have priority. Not just zebras.",
  },
  {
    id: "trap_h3",
    group: "2022 hierarchy",
    label: "H3 — do not cut a cyclist going ahead",
    detail: "Left-hooking a cycle lane is a dangerous in the debrief and in hospital.",
  },
];

export const CBT_CHECKS: ChecklistItem[] = [
  {
    id: "cbt_done",
    group: "DL196",
    label: "CBT completed",
    detail: "Compulsory Basic Training logged. Certificate valid 2 years from the date of issue.",
  },
  {
    id: "cbt_lplates",
    group: "DL196",
    label: "L plates front and rear",
    detail: "Visible, not buried under a top box. Required as a learner, including DAS practice.",
  },
  {
    id: "cbt_provisional",
    group: "DL196",
    label: "Provisional entitlement checked",
    detail: "Photocard licence shows motorcycle provisional. Theory pass is a separate certificate.",
  },
  {
    id: "cbt_eyesight",
    group: "DL196",
    label: "Eyesight — 20 m number plate",
    detail: "Same standard the examiner will use on Mod 2 before you leave the car park.",
  },
];
