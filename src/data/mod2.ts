import type { ScenarioQuestion } from "@/lib/types";

export const MOD2_SCENARIOS: ScenarioQuestion[] = [
  {
    id: "m2_life_01",
    domain: "Mod2_Observation",
    title: "Moving off — parked bay",
    situation:
      "You are about to move off from the left kerb onto a 30 mph two-way street. A van is parked 8 m behind you. Traffic is light.",
    visual: "lifesaver",
    options: [
      "Left mirror, then go — the van covers your right",
      "Mirrors, right-signal if it helps, right lifesaver, then move off without causing anyone to change speed or direction",
      "Full lock and a brisk first-gear launch so you occupy the lane before anyone arrives",
      "Wave at the examiner instead of looking",
    ],
    correctIndex: 1,
    rationale:
      "Move-off observation is a top Mod 2 serious. The van is exactly why you need the lifesaver — it hides an overtaking car in your mirror.",
    reference: "Highway Code Rule 159 / National Standard Unit 3",
    faultIfWrong: "Serious",
    dl25Category: "Move off / Observation",
  },
  {
    id: "m2_life_02",
    domain: "Mod2_Observation",
    title: "Roundabout exit check",
    situation:
      "You have taken the second exit of a four-exit roundabout. You are peeling into the exit road. A cyclist has been on your left through the gyratory.",
    visual: "roundabout",
    options: [
      "Cancel the indicator and look only ahead",
      "Left indicator as you pass the previous exit, then a left lifesaver before you commit to the exit",
      "Right lifesaver only, because UK roundabouts are clockwise",
      "Brake hard on the roundabout to let the cyclist past",
    ],
    correctIndex: 1,
    rationale:
      "Exit lifesaver. The cyclist sits in the left blind cone as you peel off. Miss it and the box marked Observation/Mirrors goes red.",
    reference: "Highway Code Rules 184–190",
    faultIfWrong: "Serious",
    dl25Category: "Junctions — roundabouts / Observation",
  },
  {
    id: "m2_pos_01",
    domain: "Mod2_Observation",
    title: "Gutter riding",
    situation:
      "A 30 mph residential street, cars parked intermittently on the left. You are riding in the dirt stripe 30 cm from the kerb to ‘be polite’.",
    visual: "position",
    options: [
      "Correct — taking less space is always safer",
      "Wrong. Ride the left wheel track, and take a more commanding position to see and be seen past the parked cars",
      "Ride the centre line continuously",
      "Filter the oncoming lane",
    ],
    correctIndex: 1,
    rationale:
      "Gutter = diesel, gravel, drain covers, and you disappear from side-road sightlines. Tyre tracks, then adjust.",
    reference: "National Standard for Riding — positioning",
    faultIfWrong: "Minor",
    dl25Category: "Positioning — normal riding",
  },
  {
    id: "m2_pos_02",
    domain: "Mod2_Observation",
    title: "White-line hugging",
    situation:
      "Two-way B-road, NSL. You sit with your head over the centre line because ‘the view is better’.",
    visual: "position",
    options: [
      "Correct on all two-way roads",
      "Only take the centre-of-lane / offside-wheel-track position when the view or a hazard justifies it, then return. Do not live on the white line",
      "Always — oncoming traffic will move",
      "Required for the independent-riding section",
    ],
    correctIndex: 1,
    rationale:
      "Commanding position is a tool, not a personality. Examiners mark riders who force oncoming traffic to pinch.",
    reference: "National Standard Unit 3 — positioning",
    faultIfWrong: "Minor",
    dl25Category: "Positioning — normal riding",
  },
  {
    id: "m2_mini_01",
    domain: "Mod2_Junctions",
    title: "Mini-roundabout straight-line",
    situation:
      "A painted mini-roundabout at a staggered crossroads. You are going ahead. The white disc is in the middle of your ‘straight’ line.",
    visual: "mini-roundabout",
    options: [
      "Ride straight over the disc to keep a safe, predictable line",
      "Give way to the right and pass around the disc; do not treat it as a kink in the road",
      "Always stop even if it is deserted",
      "Indicate right and go left",
    ],
    correctIndex: 1,
    rationale:
      "Experienced riders straight-line mini-roundabouts. Rule 188 plus a procedure fault if you flatten the disc, and a serious if anyone is on it.",
    reference: "Highway Code Rule 188",
    faultIfWrong: "Serious",
    dl25Category: "Junctions — roundabouts",
  },
  {
    id: "m2_mini_02",
    domain: "Mod2_Junctions",
    title: "Mini-roundabout signal",
    situation:
      "Mini-roundabout, turning right. A car is approaching from the right, slightly further out than you.",
    visual: "mini-roundabout",
    options: [
      "Early right signal, give way to the right, pass around the disc, then a lifesaver as you leave",
      "No signals on mini-roundabouts",
      "Left signal to pull them through",
      "Enter against the arrows if it is quicker",
    ],
    correctIndex: 0,
    rationale:
      "Signals still apply. Give way to the right. The painted arrows are not optional.",
    reference: "Highway Code Rule 188",
    faultIfWrong: "Serious",
    dl25Category: "Signals / Junctions",
  },
  {
    id: "m2_spiral_01",
    domain: "Mod2_Junctions",
    title: "Spiral roundabout, third exit",
    situation:
      "Large dual-carriageway spiral. Signs show left lane for 1st and 2nd exits, right lanes for 3rd and 4th. You want the 3rd.",
    visual: "spiral",
    options: [
      "Enter left because ‘left is safer on a bike’, then cut across the spirals",
      "Enter the correct right-hand lane early and follow the spiral markings to the 3rd exit",
      "Ride the hatched island for a shortcut",
      "Stop on the gyratory to re-read the overheads",
    ],
    correctIndex: 1,
    rationale:
      "Lane discipline on spirals is a Mod 2 cull. Get in the correct lane before you give way, then stay in it.",
    reference: "Highway Code Rules 184–187",
    faultIfWrong: "Serious",
    dl25Category: "Junctions — roundabouts / Positioning",
  },
  {
    id: "m2_spiral_02",
    domain: "Mod2_Junctions",
    title: "Spiral, missed lane",
    situation:
      "You realise late that you are in the 1st-exit lane and you wanted the 3rd. Traffic is alongside on your right.",
    visual: "spiral",
    options: [
      "Force across two lanes of the spiral",
      "Take the exit the lane gives you, then recover on the next safe road — do not fight the markings",
      "Stop in the live lane and wait for a hole",
      "U-turn on the gyratory",
    ],
    correctIndex: 1,
    rationale:
      "Independent-riding logic applies even when the examiner is directing: unsafe recovery is the fail, not the geography.",
    reference: "Highway Code Rule 187 / DVSA independent riding",
    faultIfWrong: "Serious",
    dl25Category: "Junctions — roundabouts",
  },
  {
    id: "m2_h2_01",
    domain: "Mod2_Junctions",
    title: "Left turn, pedestrian waiting",
    situation:
      "You are turning left into a side street. A pedestrian is standing at the kerb of that side street, looking at the road, not yet stepping off.",
    visual: "t-junction",
    options: [
      "Turn in — they have not started to cross so you have priority",
      "Give way. H2 / Rule 170: pedestrians waiting to cross the road you are turning into have priority",
      "Sound the horn and go",
      "Stop in the main road, blocking it, until they leave",
    ],
    correctIndex: 1,
    rationale:
      "This is the 2022 change. Waiting, not just already crossing. Examiners are instructed on it.",
    reference: "Highway Code Rule H2 / Rule 170",
    faultIfWrong: "Serious",
    dl25Category: "Junctions / Awareness of vulnerable users",
  },
  {
    id: "m2_h3_01",
    domain: "Mod2_Junctions",
    title: "Left turn vs cyclist",
    situation:
      "Cycle lane on your left, you want the next left. The cyclist is going ahead, level with your rear wheel.",
    visual: "t-junction",
    options: [
      "Beat them to the corner; cycle lanes yield at junctions",
      "Hold back and do not cut across — H3: they must not be forced to stop or swerve",
      "Enter the cycle lane to ‘claim’ it",
      "Indicate and assume they will brake",
    ],
    correctIndex: 1,
    rationale:
      "Left-hooking a cyclist is a Dangerous in the real world and a Serious/Dangerous on test.",
    reference: "Highway Code Rule H3",
    faultIfWrong: "Dangerous",
    dl25Category: "Junctions / Vulnerable road users",
  },
  {
    id: "m2_blind_01",
    domain: "Mod2_Junctions",
    title: "Blind T-junction, hedge",
    situation:
      "Give-way line is behind a hedge. From the line you can see nothing of the major road.",
    visual: "blind",
    options: [
      "Stay behind the line until a gap ‘sounds’ clear",
      "Creep to a view using clutch and rear brake, observe, then emerge when the gap is actually there",
      "Roll out at 15 mph so you are not a sitting duck",
      "Put both feet down and paddle into the live lane",
    ],
    correctIndex: 1,
    rationale:
      "Closed view = controlled peek. Not a freeze, not a launch. Paddling is a control fault.",
    reference: "Highway Code Rule 170 / National Standard",
    faultIfWrong: "Serious",
    dl25Category: "Junctions — emerging / Observation",
  },
  {
    id: "m2_sat_01",
    domain: "Mod2_Junctions",
    title: "Sat-nav: missed right",
    situation:
      "Independent riding. The unit said ‘turn right’ 40 m ago. You are now past the junction, in live 30 mph traffic.",
    visual: "satnav",
    options: [
      "Stop and U-turn across the centre line",
      "Continue, next safe left or roundabout to recover. Do not invent a manoeuvre",
      "Reverse back",
      "Cut through a petrol-station forecourt against the arrows",
    ],
    correctIndex: 1,
    rationale:
      "Composure. A missed instruction with a clean recovery is usually unmarked. The unsafe U-turn is the serious.",
    reference: "DVSA Module 2 independent riding",
    faultIfWrong: "Serious",
    dl25Category: "Response to signs / Awareness",
  },
  {
    id: "m2_sat_02",
    domain: "Mod2_Observation",
    title: "Sat-nav fixation",
    situation:
      "The device is reciting a complex junction. You glance at it three times in two seconds while approaching a roundabout.",
    visual: "satnav",
    options: [
      "Correct — the unit is the examiner’s voice",
      "Wrong. Ride the road. A glance, then eyes up. Device fixation is an observation fault",
      "Pull into the hatched area to study it",
      "Follow whatever the car in front does",
    ],
    correctIndex: 1,
    rationale:
      "Independent riding can also be ‘follow the signs’. If the screen is eating your observation, you are failing the thing it is there to test.",
    reference: "Highway Code Rule 148 / DVSA independent riding",
    faultIfWrong: "Serious",
    dl25Category: "Awareness / Planning",
  },
  {
    id: "m2_fil_01",
    domain: "Filtering",
    title: "Filter into a junction mouth",
    situation:
      "Queue on a 30 mph road. You are filtering up the offside. The next gap is a side road on the right; a driver’s wheels are turned.",
    visual: "filter",
    options: [
      "Keep the speed and occupy the gap first",
      "Abort the filter. Cover that gap — vehicles turn, pedestrians appear, and this is where filtering becomes dangerous",
      "Tap the window as you pass",
      "Move to the nearside and undertake instead",
    ],
    correctIndex: 1,
    rationale:
      "The hole is the hazard. Examiners do not require filtering; they will punish a greedy one.",
    reference: "Highway Code Rules 160, 221",
    faultIfWrong: "Dangerous",
    dl25Category: "Overtaking / Awareness",
  },
  {
    id: "m2_fil_02",
    domain: "Filtering",
    title: "Filter speed",
    situation:
      "Stationary M-way-style dual carriageway queue in a 40. You are doing 35 mph between lanes.",
    visual: "filter",
    options: [
      "Legal and wise — you are under the limit",
      "Too fast to stop for a door, a gap or a pedestrian. Slow to a speed that makes those stops possible",
      "Required so you do not impede traffic",
      "Only illegal if you use the hard shoulder",
    ],
    correctIndex: 1,
    rationale:
      "No statute mph, but National Standard riding will not defend 35 mph past mirrors. If you cannot stop, it is not a filter.",
    reference: "National Standard / Rule 160",
    faultIfWrong: "Dangerous",
    dl25Category: "Speed / Overtaking",
  },
  {
    id: "m2_x_01",
    domain: "Mod2_Junctions",
    title: "Unmarked crossroads",
    situation:
      "Rural unmarked crossroads. You are going ahead. A car is approaching from the right, slightly further out.",
    visual: "crossroads",
    options: [
      "Charge it — ahead has priority at unmarked crossroads",
      "There is no guaranteed priority. Be prepared to stop; never assume the other road will yield",
      "The vehicle on the larger-looking road always wins",
      "Sound the horn and maintain 50 mph",
    ],
    correctIndex: 1,
    rationale:
      "Unmarked crossroads are a Mod 2 special. Treat as a give-way in all directions until proved otherwise.",
    reference: "Highway Code Rule 146 / 170",
    faultIfWrong: "Serious",
    dl25Category: "Junctions — approaching at speed",
  },
  {
    id: "m2_life_03",
    domain: "Mod2_Observation",
    title: "Lane change past a tractor",
    situation:
      "You want to pass a slow tractor on a two-way 60. Mirrors show clear, but you have not looked over your shoulder.",
    visual: "lifesaver",
    options: [
      "Mirrors are sufficient at NSL",
      "Lifesaver into the passing space, then go if it is still clear — a faster vehicle can sit in the blind cone",
      "Overtake on the left using the verge",
      "Match the tractor until it indicates you through",
    ],
    correctIndex: 1,
    rationale:
      "Overtake MSM + lifesaver. Rule 163 still wants 1.5 m on a cyclist; a tractor gets the full offside and a view of oncoming.",
    reference: "Highway Code Rules 162–169",
    faultIfWrong: "Serious",
    dl25Category: "Overtaking / Mirrors",
  },
  {
    id: "m2_pos_03",
    domain: "Mod2_Observation",
    title: "Approach to parked van",
    situation:
      "A delivery van is parked on the left, hazard lights on, 40 m ahead. Oncoming traffic is close.",
    visual: "position",
    options: [
      "Hold the gutter and squeeze",
      "Slow early, take a position that gives you an escape, look under/through for feet, and do not commit until the oncoming is dealt with",
      "Overtake on the pavement",
      "Accelerate to get past before the oncoming arrives",
    ],
    correctIndex: 1,
    rationale:
      "Parked van = door, pedestrian, oncoming pinch. Slow, position, look. Racing the oncoming is a dangerous.",
    reference: "Highway Code Rules 163, 205–206",
    faultIfWrong: "Dangerous",
    dl25Category: "Awareness / Positioning",
  },
  {
    id: "m2_junc_01",
    domain: "Mod2_Junctions",
    title: "Right turn, oncoming",
    situation:
      "Right turn off a 30 mph road. An oncoming car is close. A pedestrian is waiting to cross the side road.",
    visual: "t-junction",
    options: [
      "Cut the corner so you are out of the oncoming’s way, then deal with the pedestrian",
      "Position correctly, wait for the oncoming, then give way to the pedestrian as you complete the turn",
      "Wave the car through while you sit in their lane",
      "Turn behind the pedestrian’s back",
    ],
    correctIndex: 1,
    rationale:
      "Do not cut. Yield to oncoming, then H2 to the pedestrian. Two yields, one manoeuvre.",
    reference: "Highway Code Rules 170, 180, H2",
    faultIfWrong: "Serious",
    dl25Category: "Junctions — turning right",
  },
  {
    id: "m2_life_04",
    domain: "Mod2_Observation",
    title: "Leaving a roundabout, lorry inside",
    situation:
      "Two-lane roundabout. You are in the right lane for a right turn. A lorry is in the left lane, possibly taking the same exit.",
    visual: "roundabout",
    options: [
      "Stay in the right lane and trust the lorry to stay left",
      "Do not squeeze. If the lorry’s position is ambiguous, hold back and take the exit without a lane fight; left lifesaver as you leave",
      "Accelerate around the outside of the lorry",
      "Move left across its bows to ‘claim’ the exit",
    ],
    correctIndex: 1,
    rationale:
      "HGVs sweep. Sitting in the offside and assuming they will honour their lane is how bikes get collected on the exit.",
    reference: "Highway Code Rules 187, 221",
    faultIfWrong: "Dangerous",
    dl25Category: "Junctions — roundabouts / Positioning",
  },
  {
    id: "m2_h2_02",
    domain: "Mod2_Junctions",
    title: "Zebra just after a left",
    situation:
      "You have been given a left at the next junction. Immediately after the corner is a zebra with someone on the pavement, not yet on the stripes.",
    visual: "t-junction",
    options: [
      "Complete the left at speed — they are not on the crossing yet",
      "Slow on the approach so you can give way; once they are on a zebra you MUST stop, and you should be prepared before you see them late",
      "Filter around them on the crossing",
      "Use the horn to keep them on the kerb",
    ],
    correctIndex: 1,
    rationale:
      "A zebra after a left is a Mod 2 ambush. If you arrive hot you cannot give way. Planning is the point.",
    reference: "Highway Code Rules 191–196, H2",
    faultIfWrong: "Serious",
    dl25Category: "Pedestrian crossings / Planning",
  },
  {
    id: "m2_msm_01",
    domain: "Mod2_Observation",
    title: "MSM skipped because ‘I live here’",
    situation:
      "The test route goes through a roundabout you use every day. You enter with no mirror check because you already know the lane.",
    visual: "roundabout",
    options: [
      "Local knowledge replaces MSM",
      "MSM / PSL every time. The examiner is not marking your postcode",
      "Only signal; mirrors are for learners",
      "The examiner will tell you if someone is there",
    ],
    correctIndex: 1,
    rationale:
      "Veterans fail here. The National Standard is the test, not your commute.",
    reference: "National Standard for Riding",
    faultIfWrong: "Serious",
    dl25Category: "Mirrors / Signals",
  },
  {
    id: "m2_school_01",
    domain: "Mod2_Observation",
    title: "School keep-clear, 15:20",
    situation:
      "Zig-zag keep-clear outside a primary school. A parent is waving you through a gap while a child is between parked cars.",
    visual: "position",
    options: [
      "Take the wave — the parent has the view",
      "Ignore the wave. Slow to a crawl, look for the child, do not enter the keep-clear to park or wait",
      "Accelerate so you are a smaller target",
      "Use the pavement",
    ],
    correctIndex: 1,
    rationale:
      "Never outsource observation to a waver. Children from between cars are Rule 205 in neon.",
    reference: "Highway Code Rules 205–209, 238",
    faultIfWrong: "Dangerous",
    dl25Category: "Awareness of vulnerable users",
  },
  {
    id: "m2_life_05",
    domain: "Mod2_Observation",
    title: "Moving off uphill",
    situation:
      "Hill start, 30 mph, cars behind. You are worried about rolling back so you dump the clutch.",
    visual: "lifesaver",
    options: [
      "Dumping the clutch is fine if you don’t roll",
      "Rear brake to hold, friction bite, lifesaver, then release the brake — a stall is a minor; a lunge into traffic is a serious",
      "Always use the front brake to hold on a hill",
      "Wave the following traffic past first, every time",
    ],
    correctIndex: 1,
    rationale:
      "Hill starts expose sloppy clutch work. Control first, then observation, then go. The lunge is what gets marked.",
    reference: "National Standard — move off / control",
    faultIfWrong: "Serious",
    dl25Category: "Move off / Control",
  },
  {
    id: "m2_tram_01",
    domain: "Mod2_Junctions",
    title: "Tramlines / wet metal",
    situation:
      "Wet town centre, tram or wet ironworks across your left-turn line.",
    visual: "t-junction",
    options: [
      "Lean hard across the rails to get it over with",
      "Square the bike as much as you can, slow, avoid a big lean on wet metal, look for a cleaner line",
      "Use only the front brake on the metal",
      "Follow a bus’s exact line regardless",
    ],
    correctIndex: 1,
    rationale:
      "Wet metal plus lean is a low-side. Examiners in tram towns mark riders who ignore it.",
    reference: "Highway Code Rule 306 / National Standard surfaces",
    faultIfWrong: "Serious",
    dl25Category: "Control / Awareness",
  },
];
