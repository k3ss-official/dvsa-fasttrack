import type { ShowMeTellMe } from "@/lib/types";

export const SHOW_ME_TELL_ME: ShowMeTellMe[] = [
  {
    id: "smtm_brakes",
    kind: "tell",
    prompt: "Tell me how you would check that the brakes are working before a journey.",
    answer:
      "Brakes should not feel spongy or slack. Test them as you set off; they should not pull the machine to one side, and the lever/pedal should return.",
    reference: "DVSA motorcycle safety questions — brakes",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_tyres",
    kind: "tell",
    prompt: "Tell me how you would check the tyres are correctly inflated and have enough tread.",
    answer:
      "Use a reliable gauge against the manufacturer’s figures (usually in the handbook or on a sticker). Tread at least 1.0 mm across three-quarters of the breadth, all the way around, with no cuts or bulges. Also check valves and the wheel for damage.",
    reference: "DVSA motorcycle safety questions — tyres / C&U 1 mm",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_oil",
    kind: "tell",
    prompt: "Tell me how you would check the engine oil level.",
    answer:
      "On a level surface, engine warm then settled if the maker says so. Read the sight glass between min and max, or the dipstick. Do not overfill.",
    reference: "DVSA motorcycle safety questions — oil",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_coolant",
    kind: "tell",
    prompt: "Tell me how you would check the coolant level (liquid-cooled machine).",
    answer:
      "Check the expansion tank against min/max with the engine cold. Never open a hot radiator cap.",
    reference: "DVSA motorcycle safety questions — coolant",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_brake_fluid",
    kind: "tell",
    prompt: "Tell me how you would check the brake-fluid level.",
    answer:
      "Reservoir(s) on or near the master cylinders — front lever and rear pedal. Fluid should sit between min and max. A falling level can mean pad wear or a leak; do not ride it.",
    reference: "DVSA motorcycle safety questions — brake fluid",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_chain",
    kind: "tell",
    prompt: "Tell me how you would check chain tension and condition.",
    answer:
      "With the bike on its stand, find the maker’s slack (often 20–40 mm at the tightest point through a full wheel rotation). No seized links, no rusty tight spots, lubricated. A chain that is too tight or too slack will fail you on a Tell Me and can spit you off later.",
    reference: "DVSA motorcycle safety questions — drive chain",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_horn",
    kind: "tell",
    prompt: "Tell me how you would check that the horn is working.",
    answer:
      "Turn the ignition on and press the horn button. It should sound clearly. Do not test it in a way that startles others — the examiner will usually accept a brief press.",
    reference: "DVSA motorcycle safety questions — horn",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_kill",
    kind: "tell",
    prompt: "Tell me how you would check the engine cut-out switch (kill switch).",
    answer:
      "With the engine running, operate the kill switch — the engine must stop. Reset it after. This is not a party trick; it is the control you will want in a capsize.",
    reference: "DVSA motorcycle safety questions — cut-out",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_lights",
    kind: "tell",
    prompt: "Tell me how you would check that the headlight, tail light and brake light work.",
    answer:
      "Ignition on: dipped and main, tail lamp. Brake light from both the front lever and the rear pedal (many bikes need both checks). Walk round or use a reflection. Indicators: left, right, cancel.",
    reference: "DVSA motorcycle safety questions — lights",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_steering",
    kind: "tell",
    prompt: "Tell me how you would check the steering for play or tightness.",
    answer:
      "With the bike supported, turn the bars lock to lock. They should move freely without notchiness, and there should be no play at the headstock. A clunk or a stiff spot is a fail-to-ride issue.",
    reference: "DVSA motorcycle safety questions — steering",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_show_horn",
    kind: "show",
    prompt: "When it is safe, show me how you would use the horn.",
    answer:
      "On the move, when asked, press the horn. One clear sound. Do not ride around beeping ‘to be seen’ — that is not the test, and it is not legal warning use.",
    reference: "DVSA on-move ‘show me’ / Highway Code Rule 112",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_show_brake",
    kind: "show",
    prompt: "When it is safe, show me how you would operate the rear brake light (or confirm the brake light).",
    answer:
      "Apply the rear brake enough to light the lamp, without unsettling the bike. The examiner is usually behind you for this.",
    reference: "DVSA on-move ‘show me’",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_show_dip",
    kind: "show",
    prompt: "When it is safe, show me how you switch between dipped and main beam.",
    answer:
      "One clean pass of the switch, then back to dipped so you do not dazzle. Know which way your bike’s switch works before the test, not during it.",
    reference: "DVSA on-move ‘show me’ / Rule 115",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_show_ind",
    kind: "show",
    prompt: "When it is safe, show me how you operate the indicators.",
    answer:
      "Left, cancel, right, cancel. Do it without staring at the switchgear. Cancel is part of the demonstration.",
    reference: "DVSA on-move ‘show me’",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_show_fog",
    kind: "show",
    prompt: "If fitted: when it is safe, show me how you would switch on the rear fog light.",
    answer:
      "Know the switch. Rear fog only when visibility is seriously reduced (typically under 100 m). Switching it on in clear air as a ‘safety extra’ is a fault.",
    reference: "DVSA on-move ‘show me’ / Highway Code Rule 226",
    domain: "Legal_Equipment",
  },
  {
    id: "smtm_clutch",
    kind: "tell",
    prompt: "Tell me how you would know if the clutch needed adjustment or was slipping.",
    answer:
      "Excessive free play at the lever, a biting point at the bar, or the engine revs rising without matching road speed under load. Check cable/hydraulic level per the handbook.",
    reference: "DVSA motorcycle safety questions — clutch",
    domain: "Legal_Equipment",
  },
];
