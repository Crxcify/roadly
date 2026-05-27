// Static reference data for the app.

export const CAR_BRANDS = [
  "Audi", "BMW", "Citroën", "Fiat", "Ford", "Honda", "Hyundai", "Kia",
  "Mazda", "Mercedes-Benz", "Mini", "Nissan", "Opel", "Peugeot", "Renault",
  "Seat", "Škoda", "Suzuki", "Tesla", "Toyota", "Vauxhall", "Volkswagen", "Volvo",
] as const;

export const MODELS_BY_BRAND: Record<string, string[]> = {
  "Audi": ["A1", "A3", "A4", "Q2", "Q3"],
  "BMW": ["1 Series", "2 Series", "3 Series", "X1"],
  "Citroën": ["C1", "C3", "C4"],
  "Fiat": ["500", "Panda", "Tipo"],
  "Ford": ["Fiesta", "Focus", "Puma", "Kuga"],
  "Honda": ["Civic", "Jazz", "HR-V"],
  "Hyundai": ["i10", "i20", "i30", "Kona"],
  "Kia": ["Picanto", "Rio", "Ceed", "Stonic"],
  "Mazda": ["2", "3", "CX-3", "CX-30"],
  "Mercedes-Benz": ["A-Class", "B-Class", "CLA"],
  "Mini": ["Cooper", "Countryman"],
  "Nissan": ["Micra", "Juke", "Qashqai"],
  "Opel": ["Corsa", "Astra"],
  "Peugeot": ["108", "208", "308", "2008"],
  "Renault": ["Clio", "Captur", "Megane"],
  "Seat": ["Ibiza", "Leon", "Arona"],
  "Škoda": ["Fabia", "Scala", "Kamiq", "Octavia"],
  "Suzuki": ["Swift", "Vitara", "Ignis"],
  "Tesla": ["Model 3", "Model Y"],
  "Toyota": ["Aygo", "Yaris", "Corolla", "C-HR"],
  "Vauxhall": ["Corsa", "Astra", "Crossland"],
  "Volkswagen": ["Polo", "Golf", "T-Cross", "T-Roc"],
  "Volvo": ["XC40", "V40"],
};

export interface Topic { id: string; title: string; total: number; color: string; iconKey: string; summary: string; }
export const TOPICS: Topic[] = [
  { id: "road-signs", title: "Road Signs", total: 20, color: "destructive", iconKey: "sign", summary: "Warning, regulatory and informational signs you'll meet on every drive." },
  { id: "rules", title: "Rules of the Road", total: 20, color: "primary", iconKey: "book", summary: "Right of way, speed limits, junctions and the rules every driver must follow." },
  { id: "traffic", title: "Road and Traffic", total: 20, color: "warning", iconKey: "traffic", summary: "Roundabouts, motorway driving, lane discipline and reading traffic flow." },
  { id: "vehicle", title: "Vehicle Safety", total: 15, color: "primary", iconKey: "shield", summary: "Tyres, brakes, lights, fluids — what to check and when." },
  { id: "hazard", title: "Hazard Perception", total: 15, color: "destructive", iconKey: "alert", summary: "Spotting developing hazards early — pedestrians, cyclists, weather and more." },
];

export interface Lesson { id: string; topic: string; title: string; minutes: number; body: string[]; }
export const LESSONS: Lesson[] = [
  {
    id: "ls-warn", topic: "road-signs", title: "Warning Signs", minutes: 4,
    body: [
      "Warning signs are usually red-bordered triangles that alert you to hazards ahead. They never tell you what to do — they tell you what's coming.",
      "Common warnings include crossroads, bends, slippery surfaces, road narrows and pedestrian crossings.",
      "Read the road 12–15 seconds ahead so you can react to a warning sign before you arrive at the hazard. Reduce speed early and check your mirrors.",
      "If you see a quick succession of warning signs, you're approaching a complex junction or hazard — be ready to stop.",
    ],
  },
  {
    id: "ls-reg", topic: "road-signs", title: "Regulatory Signs", minutes: 5,
    body: [
      "Regulatory signs give an order you must obey. Most are circular: red rings forbid an action, blue circles give a positive instruction.",
      "Speed-limit signs are red-bordered circles with the limit in the centre. The national speed-limit sign is a white circle with a black diagonal stripe.",
      "STOP signs and GIVE WAY signs are the two exceptions to the circle rule — they have unique shapes so you can recognise them even when partly hidden.",
      "Ignoring a regulatory sign typically means failing your driving test instantly. Always look for them at junctions, on entry to estates, and on motorway slip-roads.",
    ],
  },
  {
    id: "ls-rules-row", topic: "rules", title: "Right of Way", minutes: 5,
    body: [
      "At an uncontrolled junction, give way to traffic on the major road. If markings are unclear, treat it as a give-way junction and be ready to stop.",
      "On roundabouts, give way to traffic already on the roundabout (typically from the right in countries that drive on the left).",
      "Emergency vehicles with sirens and blue lights always have priority — pull in safely as soon as you can, do not brake sharply.",
      "Pedestrians who have stepped onto a zebra crossing have absolute priority. Make eye contact and wait until they are fully clear of your lane.",
    ],
  },
  {
    id: "ls-rules-speed", topic: "rules", title: "Speed Limits", minutes: 4,
    body: [
      "Built-up areas typically default to 30 mph / 50 km/h. Single carriageways 60 mph / 100 km/h. Dual carriageways and motorways 70 mph / 120 km/h.",
      "Speed limits are an upper limit, not a target. Drive to the conditions — weather, traffic, visibility and the road surface all matter.",
      "Repeater signs on lampposts confirm the current limit; if you see streetlights and no signs, you're in a 30 zone unless told otherwise.",
      "On test, even 1 mph over the limit can be marked. Make it a habit to glance at your speedo every few seconds.",
    ],
  },
  {
    id: "ls-traffic-rdb", topic: "traffic", title: "Roundabouts", minutes: 5,
    body: [
      "Approach in the correct lane: left lane for first exit (and usually straight on), right lane for later exits.",
      "Signal left to leave the roundabout — start your signal as you pass the exit before yours.",
      "Watch for cyclists and motorcyclists in your blind spot — roundabouts are one of the most common places for collisions with vulnerable road users.",
      "If in doubt, take an extra lap rather than swerving across lanes. It's safer and you won't fail your test for it.",
    ],
  },
  {
    id: "ls-traffic-mway", topic: "traffic", title: "Motorway Driving", minutes: 6,
    body: [
      "Match the speed of motorway traffic before you leave the slip-road. Don't crawl onto the carriageway.",
      "Keep left unless overtaking. The right lane is for overtaking only — don't sit in it.",
      "Two-second rule in good conditions, four seconds in rain, ten seconds in ice or fog.",
      "If you break down, get to the hard shoulder or an emergency refuge area, leave the vehicle on the passenger side, and stand behind the barrier.",
    ],
  },
  {
    id: "ls-veh-checks", topic: "vehicle", title: "Daily Checks (POWDER)", minutes: 4,
    body: [
      "Petrol/diesel — enough fuel for your journey plus reserve.",
      "Oil — check weekly when the engine is cold and on level ground.",
      "Water — coolant and screenwash both topped up.",
      "Damage — walk around the car and check for new scrapes or low tyres.",
      "Electrics — lights, indicators, brake lights and dashboard warnings.",
      "Rubber — tyre tread (1.6 mm minimum) and pressures correct for load.",
    ],
  },
  {
    id: "ls-veh-tyres", topic: "vehicle", title: "Tyres & Brakes", minutes: 4,
    body: [
      "The legal minimum tread depth is 1.6 mm across the central three-quarters of the tyre. Replace earlier in winter.",
      "Check tyre pressures monthly when cold. Under-inflation increases fuel use, wear and braking distance.",
      "Spongy brakes, grinding noises or a pulling sensation when braking all mean you should stop and get it checked.",
      "ABS prevents wheels locking under heavy braking — press firmly and steer; do not pump the pedal.",
    ],
  },
  {
    id: "ls-hazard-scan", topic: "hazard", title: "Scanning & Mirrors", minutes: 5,
    body: [
      "Mirrors every 5–8 seconds. Before any change of direction, speed or lane: Mirror–Signal–Manoeuvre.",
      "Scan far ahead — 12–15 seconds in town, 20+ seconds at motorway speeds.",
      "Look for body language: pedestrians glancing at the road, cyclists' head-checks, brake lights three cars ahead.",
      "Always assume the worst-case action by another road user and plan an escape route.",
    ],
  },
  {
    id: "ls-hazard-weather", topic: "hazard", title: "Bad Weather", minutes: 5,
    body: [
      "Rain doubles your stopping distance. Slow down and increase your following distance.",
      "Fog: use dipped headlights and fog lights only when visibility drops below 100 m. Turn them off when visibility improves.",
      "Snow and ice: gentle inputs only. Pull away in second gear to reduce wheelspin.",
      "Standing water: ease off the accelerator — never brake — and steer straight through.",
    ],
  },
];

export interface Question {
  id: string;
  topic: string;
  prompt: string;
  signKind?: "warning" | "stop" | "give-way" | "regulatory";
  signLabel?: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export const QUESTIONS: Question[] = [
  { id: "q1", topic: "road-signs", prompt: "What does this road sign mean?", signKind: "warning", signLabel: "+", choices: ["Crossroads ahead", "T-junction ahead", "Side road on the left", "Roundabout ahead"], answer: 0, explanation: "A red triangle with a plus symbol warns of a crossroads ahead." },
  { id: "q2", topic: "road-signs", prompt: "A red triangular sign with an exclamation mark means?", signKind: "warning", signLabel: "!", choices: ["Stop", "Warning", "Give way", "No entry"], answer: 1, explanation: "Red triangles are warning signs — they tell you a hazard is ahead." },
  { id: "q3", topic: "road-signs", prompt: "What shape is a STOP sign?", signKind: "stop", signLabel: "STOP", choices: ["Triangle", "Octagon", "Circle", "Square"], answer: 1, explanation: "STOP signs are octagons — unique shape so you can recognise them even if covered." },
  { id: "q4", topic: "road-signs", prompt: "What does a red circle with '30' inside mean?", signKind: "regulatory", signLabel: "30", choices: ["Minimum speed 30", "Maximum speed 30", "Distance 30 miles", "30-minute parking"], answer: 1, explanation: "Red-ringed circles forbid or limit. This sets the maximum speed to 30." },
  { id: "q5", topic: "road-signs", prompt: "An inverted triangle ('▽') means?", signKind: "give-way", signLabel: "▽", choices: ["Stop", "Give way", "No entry", "Roundabout"], answer: 1, explanation: "An upside-down triangle is the Give Way sign." },

  { id: "q6", topic: "rules", prompt: "When should you use your hazard lights while driving?", choices: ["In heavy rain", "To warn of a hazard ahead on a motorway", "When parked illegally", "To thank another driver"], answer: 1, explanation: "Hazard lights warn following traffic of a danger ahead, e.g. queuing traffic on a motorway." },
  { id: "q7", topic: "rules", prompt: "The national speed limit on a single carriageway is?", choices: ["50 mph", "60 mph", "70 mph", "80 mph"], answer: 1, explanation: "60 mph for cars on a single carriageway with the national speed-limit sign." },
  { id: "q8", topic: "rules", prompt: "You must give way at?", choices: ["Every junction", "Only roundabouts", "Junctions marked with give way", "Never if you have right of way"], answer: 2, explanation: "Always give way at junctions with give-way markings or signs." },
  { id: "q9", topic: "rules", prompt: "Where there are streetlights and no speed sign, the limit is usually?", choices: ["20 mph", "30 mph", "40 mph", "50 mph"], answer: 1, explanation: "Streetlights without repeater signs indicate a 30 mph built-up area." },
  { id: "q10", topic: "rules", prompt: "Approaching a pelican crossing with a flashing amber light you must?", choices: ["Stop", "Give way to pedestrians on the crossing", "Speed up", "Sound your horn"], answer: 1, explanation: "Flashing amber means give way to pedestrians already on the crossing, then proceed." },

  { id: "q11", topic: "traffic", prompt: "At a zebra crossing you must?", choices: ["Slow down only", "Sound your horn", "Give way to pedestrians", "Drive through quickly"], answer: 2, explanation: "Pedestrians on or stepping onto a zebra have priority." },
  { id: "q12", topic: "traffic", prompt: "Two-second rule applies to?", choices: ["Parking", "Following distance in good conditions", "Indicating", "Stopping at lights"], answer: 1, explanation: "Stay at least 2 seconds behind the car in front in good conditions, more in rain or fog." },
  { id: "q13", topic: "traffic", prompt: "On a motorway you should normally drive in the?", choices: ["Right lane", "Middle lane", "Left lane unless overtaking", "Hard shoulder"], answer: 2, explanation: "Keep left unless overtaking — sitting in the middle or right lane is a fault." },
  { id: "q14", topic: "traffic", prompt: "When entering a roundabout you give way to traffic from?", choices: ["The left", "The right", "Behind you", "All directions"], answer: 1, explanation: "In countries that drive on the left, give way to traffic already on the roundabout (from your right)." },
  { id: "q15", topic: "traffic", prompt: "A bus lane sign shows hours. Outside those hours you?", choices: ["Cannot use it ever", "Can drive in it", "Must indicate", "Must use a fog light"], answer: 1, explanation: "If a bus lane shows times of operation, it is open to all traffic outside those times." },

  { id: "q16", topic: "vehicle", prompt: "The legal minimum tyre tread depth in the UK and Ireland is?", choices: ["1.0 mm", "1.6 mm", "2.0 mm", "3.0 mm"], answer: 1, explanation: "1.6 mm across the central 3/4 of the tyre, around the full circumference." },
  { id: "q17", topic: "vehicle", prompt: "When should you check your mirrors?", choices: ["Only when turning", "Regularly and before any manoeuvre", "Only on motorways", "Never"], answer: 1, explanation: "Mirror–Signal–Manoeuvre. Mirrors every 5–8 seconds and before every action." },
  { id: "q18", topic: "vehicle", prompt: "ABS helps you to?", choices: ["Brake more gently", "Steer while braking hard", "Increase top speed", "Save fuel"], answer: 1, explanation: "Anti-lock brakes stop the wheels locking so you keep steering control under heavy braking." },
  { id: "q19", topic: "vehicle", prompt: "When should you check tyre pressures?", choices: ["After a long drive", "When tyres are cold", "Only at MOT time", "When it rains"], answer: 1, explanation: "Hot tyres read higher — always check when cold." },
  { id: "q20", topic: "vehicle", prompt: "A red dashboard light usually means?", choices: ["Routine reminder", "Safe to ignore", "Stop as soon as safe", "Service is due"], answer: 2, explanation: "Red = stop. Amber = caution. Green/blue = information." },

  { id: "q21", topic: "hazard", prompt: "A ball rolls into the road ahead. You should?", choices: ["Sound your horn", "Brake and be ready for a child", "Swerve sharply", "Maintain speed"], answer: 1, explanation: "Where there's a ball there's usually a child. Cover the brake and reduce speed." },
  { id: "q22", topic: "hazard", prompt: "Driving in fog you should?", choices: ["Use full beam", "Use fog lights and slow down", "Tailgate the car in front", "Speed up to escape"], answer: 1, explanation: "Full beam reflects off the fog and dazzles you. Use dipped + fog lights and increase your gap." },
  { id: "q23", topic: "hazard", prompt: "You see a cyclist ahead. You should?", choices: ["Overtake immediately", "Sound your horn", "Give them at least 1.5 m space", "Drive close to push past"], answer: 2, explanation: "Leave at least 1.5 m when overtaking cyclists — more at higher speeds." },
  { id: "q24", topic: "hazard", prompt: "Aquaplaning means?", choices: ["Wheels lose grip on water", "Brakes fade from heat", "Engine overheats", "Tyres deflate"], answer: 0, explanation: "A film of water lifts the tyre off the road. Ease off, don't brake, and steer straight." },
  { id: "q25", topic: "hazard", prompt: "Driving at night your speed should be?", choices: ["The same as daytime", "Such that you can stop within the distance you can see", "Always 50 km/h", "Faster to clear the road"], answer: 1, explanation: "Never drive faster than you can stop within the visible distance — your headlights set your safe speed." },

  { id: "q26", topic: "road-signs", prompt: "A blue circular sign means?", signKind: "regulatory", signLabel: "↑", choices: ["Warning", "Information only", "A positive instruction you must follow", "Prohibition"], answer: 2, explanation: "Blue circles give a positive instruction such as 'turn left' or 'mini-roundabout'." },
  { id: "q27", topic: "road-signs", prompt: "A red circle with a red diagonal bar over a car means?", signKind: "regulatory", signLabel: "⊘", choices: ["No cars", "Car park", "One-way street", "End of restriction"], answer: 0, explanation: "Red ring with a diagonal bar prohibits the symbol shown — here, no motor cars." },
  { id: "q28", topic: "road-signs", prompt: "A green rectangular sign on a motorway shows?", signKind: "regulatory", signLabel: "M", choices: ["Primary route directions", "Motorway directions", "Tourist information", "Temporary diversions"], answer: 1, explanation: "Blue = motorway, green = primary route, white = non-primary, brown = tourist." },
  { id: "q29", topic: "road-signs", prompt: "A red circle with a white horizontal bar means?", signKind: "regulatory", signLabel: "—", choices: ["No entry for vehicular traffic", "One way", "Road closed temporarily", "Give way"], answer: 0, explanation: "This is the 'no entry' sign — you must not pass it." },
  { id: "q30", topic: "road-signs", prompt: "A yellow box junction means you must not enter unless?", choices: ["You are turning right and only oncoming traffic prevents you", "There is no traffic in front of you", "The lights are amber", "It is between 7am and 7pm"], answer: 0, explanation: "Never enter a yellow box unless your exit is clear — except when turning right and only oncoming traffic stops you." },

  { id: "q31", topic: "rules", prompt: "The national speed limit for a car on a dual carriageway is?", choices: ["50 mph", "60 mph", "70 mph", "80 mph"], answer: 2, explanation: "70 mph for cars/motorcycles on dual carriageways and motorways." },
  { id: "q32", topic: "rules", prompt: "You must stop when signalled to do so by?", choices: ["Any pedestrian", "A police officer, traffic warden, school crossing patrol or red traffic light", "Anyone flashing their headlights", "A passenger in another car"], answer: 1, explanation: "These authorised people and signals have legal power to stop you." },
  { id: "q33", topic: "rules", prompt: "The minimum age to hold a full UK car driving licence is?", choices: ["16", "17", "18", "21"], answer: 1, explanation: "You can apply at 15 years 9 months and drive from 17." },
  { id: "q34", topic: "rules", prompt: "When can you overtake on the left?", choices: ["Never", "When the vehicle ahead is turning right and there is room", "On any road", "Only at night"], answer: 1, explanation: "You may pass on the left when the driver ahead is signalling right, or in slow-moving queues." },
  { id: "q35", topic: "rules", prompt: "It is illegal to use a hand-held phone while?", choices: ["Only on motorways", "Driving or stopped at lights with the engine on", "Only when moving above 30 mph", "Only on calls — texts are fine"], answer: 1, explanation: "Hand-held phone use is illegal whenever the engine is on, including at lights." },
  { id: "q36", topic: "rules", prompt: "The legal alcohol limit in England and Wales is (per 100ml breath)?", choices: ["22 µg", "35 µg", "50 µg", "80 µg"], answer: 1, explanation: "35 micrograms in 100ml of breath. Scotland is lower at 22 µg." },
  { id: "q37", topic: "rules", prompt: "Who is responsible for ensuring under-14 passengers wear a seatbelt?", choices: ["The passenger", "Their parent only", "The driver", "Nobody"], answer: 2, explanation: "The driver is legally responsible for passengers under 14 being properly restrained." },

  { id: "q38", topic: "traffic", prompt: "At traffic lights, amber on its own means?", choices: ["Stop, unless you are so close you cannot safely do so", "Go", "Speed up", "Give way to oncoming traffic"], answer: 0, explanation: "Steady amber = stop, unless stopping would be unsafe." },
  { id: "q39", topic: "traffic", prompt: "A flashing amber light at a junction with a pedestrian crossing means?", choices: ["Stop and wait", "Give way to pedestrians on the crossing", "Drive on quickly", "Sound your horn"], answer: 1, explanation: "Pelican crossings flash amber — give way to pedestrians, otherwise proceed." },
  { id: "q40", topic: "traffic", prompt: "On a three-lane motorway you may use the right lane for?", choices: ["Cruising at the speed limit", "Overtaking only", "Heavy goods vehicles", "Slow vehicles"], answer: 1, explanation: "The right-most lane is for overtaking. Return to the left when done." },
  { id: "q41", topic: "traffic", prompt: "You see a 'No through road' sign. This means?", choices: ["The road is closed today", "The road has no exit at the far end", "The road has roadworks", "Only buses allowed"], answer: 1, explanation: "It marks a cul-de-sac — you will have to turn around." },
  { id: "q42", topic: "traffic", prompt: "Approaching a school crossing patrol showing a 'STOP' sign you must?", choices: ["Slow down only", "Stop until the sign is withdrawn", "Sound your horn", "Drive through if no children are visible"], answer: 1, explanation: "It is a legal stop — wait until the patrol lowers the sign." },
  { id: "q43", topic: "traffic", prompt: "Mini-roundabouts should be treated like normal roundabouts and you must?", choices: ["Drive over the central marking", "Give way to traffic from the right", "Always stop", "Give way to the left"], answer: 1, explanation: "Same priority rule — give way to the right and avoid driving over the central spot if possible." },

  { id: "q44", topic: "vehicle", prompt: "When is it safe to drive with a tyre pressure warning light on?", choices: ["For short trips", "Only on motorways", "Not safe — check pressures as soon as possible", "If the tyres look fine"], answer: 2, explanation: "Under-inflation harms grip and braking. Stop and check at the next opportunity." },
  { id: "q45", topic: "vehicle", prompt: "Your windscreen is dirty inside. You should?", choices: ["Wipe with a wet finger when driving", "Clean it before setting off", "Use only the wipers", "Spray water from outside"], answer: 1, explanation: "Glare from a dirty windscreen is dangerous — clean before driving." },
  { id: "q46", topic: "vehicle", prompt: "Engine oil should be checked?", choices: ["Only at service time", "Regularly, with the engine cold and on level ground", "Only when the warning light comes on", "Every time you refuel"], answer: 1, explanation: "Check oil cold, on level ground, between min/max on the dipstick." },
  { id: "q47", topic: "vehicle", prompt: "You smell petrol while driving. You should?", choices: ["Ignore it", "Open all windows and continue", "Stop safely and investigate", "Drive faster to clear the fumes"], answer: 2, explanation: "A fuel leak is a fire risk — stop, switch off and check or call for help." },
  { id: "q48", topic: "vehicle", prompt: "If your brakes feel 'spongy' you should?", choices: ["Pump them and carry on", "Have them checked immediately", "Use the handbrake instead", "Add brake fluid yourself and drive on"], answer: 1, explanation: "Spongy brakes can mean air or fluid loss — get them checked before driving further." },

  { id: "q49", topic: "hazard", prompt: "An emergency vehicle approaches with sirens on. You should?", choices: ["Brake hard immediately", "Keep calm, signal and pull over safely where it is legal", "Speed up to clear the road", "Stop in the middle of the lane"], answer: 1, explanation: "Pull over only where it is safe and legal — do not enter a bus lane or red light." },
  { id: "q50", topic: "hazard", prompt: "Driving in heavy rain your stopping distance is approximately?", choices: ["Half the dry distance", "The same as dry", "Twice the dry distance", "Ten times the dry distance"], answer: 2, explanation: "Wet roads roughly double your stopping distance — icy roads can multiply it ten times." },
  { id: "q51", topic: "hazard", prompt: "You feel sleepy on a motorway. You should?", choices: ["Open a window and continue", "Turn the radio up", "Leave at the next services and rest", "Drink coffee while driving"], answer: 2, explanation: "Take a 15-minute break and a caffeinated drink — never fight sleep at the wheel." },
  { id: "q52", topic: "hazard", prompt: "Approaching a horse rider you should?", choices: ["Sound your horn early", "Pass closely at speed", "Slow down, give plenty of room and pass wide and slow", "Flash your lights"], answer: 2, explanation: "Pass horses at no more than 10 mph with at least 2 m clearance — they spook easily." },
  { id: "q53", topic: "hazard", prompt: "You are first at the scene of a crash. You should?", choices: ["Move all injured people to the verge", "Warn other traffic, call 999 and only move casualties if there's immediate danger", "Take photos for insurance first", "Give a casualty water"], answer: 1, explanation: "Protect the scene, call emergency services, don't move casualties unless they're in danger." },
  { id: "q54", topic: "hazard", prompt: "Black ice is most likely on?", choices: ["Bright dry roads", "Shaded bends and bridges in cold weather", "Motorways in summer", "Gravel tracks"], answer: 1, explanation: "Bridges and shaded spots freeze first — they often look wet, not icy." },
  { id: "q55", topic: "hazard", prompt: "If your car starts to skid, you should?", choices: ["Brake hard", "Steer into the skid and ease off the accelerator", "Pull the handbrake", "Close your eyes"], answer: 1, explanation: "Look and steer where you want to go, ease off power, avoid harsh braking." },

  // ===== Expanded bank (q56–q160) =====
  { id: "q56", topic: "road-signs", prompt: "A circular blue sign with a white arrow pointing up means?", signKind: "regulatory", signLabel: "↑", choices: ["Ahead only", "One way street", "No entry", "End of restriction"], answer: 0, explanation: "Blue circles give a positive instruction — this one means ahead only." },
  { id: "q57", topic: "road-signs", prompt: "A red triangle with a wavy line means?", signKind: "warning", signLabel: "~", choices: ["Slippery road", "Road narrows", "Uneven road", "Bend ahead"], answer: 0, explanation: "Wavy line in a warning triangle warns of a slippery road surface." },
  { id: "q58", topic: "road-signs", prompt: "A red triangle showing two children means?", signKind: "warning", signLabel: "👫", choices: ["Playground area", "School crossing", "Pedestrians only", "No children allowed"], answer: 1, explanation: "Warning of a school crossing patrol or children nearby — slow down." },
  { id: "q59", topic: "road-signs", prompt: "A round blue sign with a white bike means?", signKind: "regulatory", signLabel: "🚲", choices: ["No cycling", "Cycle route only", "Shared use path", "End of cycle lane"], answer: 1, explanation: "Blue circle with a bike = compulsory route for pedal cycles only." },
  { id: "q60", topic: "road-signs", prompt: "A red triangle showing a deer warns of?", signKind: "warning", signLabel: "🦌", choices: ["Petting zoo", "Wild animals on the road", "Farm exit", "Hunting area"], answer: 1, explanation: "Wild animals (often deer) may cross — drive carefully especially at dawn/dusk." },
  { id: "q61", topic: "road-signs", prompt: "A red triangle showing a cyclist warns of?", signKind: "warning", signLabel: "🚲", choices: ["Cycle lane ends", "Cyclists likely on the road", "No cycling", "Bike repair shop"], answer: 1, explanation: "Watch for cyclists ahead — give them plenty of space." },
  { id: "q62", topic: "road-signs", prompt: "A red triangle with an arrow curving right warns of?", signKind: "warning", signLabel: "↷", choices: ["Roundabout ahead", "Bend to the right", "T-junction", "U-turn ahead"], answer: 1, explanation: "Bend warning — reduce speed before entering." },
  { id: "q63", topic: "road-signs", prompt: "A circular sign with a red bar through a number 50 means?", signKind: "regulatory", signLabel: "50", choices: ["Minimum 50", "End of 50 limit", "Recommended 50", "School zone 50"], answer: 1, explanation: "A diagonal line through a speed limit cancels it." },
  { id: "q64", topic: "road-signs", prompt: "A brown sign usually points to?", signKind: "regulatory", signLabel: "i", choices: ["Motorway services", "Tourist attractions", "Hospital", "Police"], answer: 1, explanation: "Brown signs direct you to tourist sites and attractions." },
  { id: "q65", topic: "road-signs", prompt: "A square sign with a white H on blue means?", signKind: "regulatory", signLabel: "H", choices: ["Hotel", "Hospital with A&E", "Helipad only", "Highway"], answer: 1, explanation: "Blue H = hospital — useful when you need urgent help." },
  { id: "q66", topic: "road-signs", prompt: "A warning triangle showing a tractor means?", signKind: "warning", signLabel: "🚜", choices: ["Farm exit", "No tractors", "Slow vehicles ahead", "Roadworks"], answer: 0, explanation: "Beware of farm vehicles emerging onto the road." },
  { id: "q67", topic: "road-signs", prompt: "A yellow diamond temporary sign is for?", signKind: "warning", signLabel: "⚠", choices: ["Permanent works", "Temporary roadworks or events", "Diversion only", "Bus lanes"], answer: 1, explanation: "Yellow signs indicate temporary conditions (roadworks, events)." },
  { id: "q68", topic: "road-signs", prompt: "A red triangle showing a falling rock warns of?", signKind: "warning", signLabel: "🪨", choices: ["Quarry exit", "Falling or fallen rocks", "Steep drop", "Loose chippings"], answer: 1, explanation: "Be ready to brake — fallen rocks may be on the road." },
  { id: "q69", topic: "road-signs", prompt: "A circular sign with two arrows (red & black) means?", signKind: "regulatory", signLabel: "⇅", choices: ["No overtaking", "Priority to oncoming traffic", "Give way to oncoming traffic", "Two-way traffic"], answer: 2, explanation: "Red arrow points your way — give way to oncoming vehicles." },
  { id: "q70", topic: "road-signs", prompt: "A blue rectangle with a white P means?", signKind: "regulatory", signLabel: "P", choices: ["No parking", "Parking permitted", "Police station", "Petrol station"], answer: 1, explanation: "Blue P = parking is permitted (often with conditions below)." },

  { id: "q71", topic: "rules", prompt: "What is the minimum insurance required to drive on the road?", choices: ["No insurance", "Third party", "Fully comprehensive", "Breakdown cover"], answer: 1, explanation: "Third-party insurance is the legal minimum." },
  { id: "q72", topic: "rules", prompt: "You may park on the right at night on a one-way street?", choices: ["Never", "Only with sidelights", "Only with hazard lights", "Yes, freely"], answer: 3, explanation: "On a one-way street you may park on either side." },
  { id: "q73", topic: "rules", prompt: "Children aged 3–12 and under 135cm must use?", choices: ["Adult seatbelt only", "A booster seat or child restraint", "No restraint required", "Lap belt only"], answer: 1, explanation: "Until 135cm or 12 years old, an appropriate child restraint is required." },
  { id: "q74", topic: "rules", prompt: "Using a mobile phone hands-free while driving is?", choices: ["Always illegal", "Legal but can still get you prosecuted if distracted", "Encouraged", "Only legal on motorways"], answer: 1, explanation: "Hands-free is legal but you can be done for careless driving if distracted." },
  { id: "q75", topic: "rules", prompt: "You may stop on the hard shoulder of a motorway?", choices: ["For a phone call", "For a picnic", "Only in an emergency", "If you're lost"], answer: 2, explanation: "Hard shoulder is for emergencies only." },
  { id: "q76", topic: "rules", prompt: "A solid white line in the centre of the road means?", choices: ["You may overtake", "You must not cross or straddle it unless safe and necessary", "Bus lane", "Cycle lane"], answer: 1, explanation: "Solid white centre lines should not normally be crossed." },
  { id: "q77", topic: "rules", prompt: "Double yellow lines at the kerb mean?", choices: ["No waiting at any time", "Loading only", "Parking with permit", "Free parking"], answer: 0, explanation: "Double yellows = no waiting at any time." },
  { id: "q78", topic: "rules", prompt: "A red route 'no stopping' sign applies?", choices: ["Only on weekdays", "At all times unless signed otherwise", "Only during the day", "Only to lorries"], answer: 1, explanation: "Red routes prohibit stopping at all times unless signs say otherwise." },
  { id: "q79", topic: "rules", prompt: "Flashing your headlights should be used to?", choices: ["Thank another driver", "Warn you are there", "Tell someone to go", "Show frustration"], answer: 1, explanation: "Headlight flashes have the same meaning as the horn — to let others know you are there." },
  { id: "q80", topic: "rules", prompt: "Drivers on a probationary licence in the UK lose their licence after?", choices: ["3 penalty points in 2 years", "6 points in 2 years", "9 points in 2 years", "12 points ever"], answer: 1, explanation: "New drivers reach the limit at 6 points in the first 2 years." },
  { id: "q81", topic: "rules", prompt: "You must use dipped headlights when?", choices: ["Always at night", "Driving in poor daytime visibility", "Both of the above", "Only in fog"], answer: 2, explanation: "Use dipped beam at night and whenever visibility is seriously reduced." },
  { id: "q82", topic: "rules", prompt: "It is illegal to drive with a tyre below the minimum tread depth on?", choices: ["Front tyres only", "Any tyre on the vehicle", "Spare tyre only", "Rear tyres only"], answer: 1, explanation: "All four tyres must meet the legal minimum at all times." },
  { id: "q83", topic: "rules", prompt: "When following a large vehicle you should?", choices: ["Drive close to be seen", "Stay back so you can see the mirrors", "Overtake immediately", "Flash your lights"], answer: 1, explanation: "If you can't see their mirrors, the driver can't see you." },
  { id: "q84", topic: "rules", prompt: "On approaching a level crossing with flashing red lights you must?", choices: ["Stop", "Speed up to clear it", "Sound horn", "Ignore if no train"], answer: 0, explanation: "Flashing red = stop. Wait until the lights go out." },
  { id: "q85", topic: "rules", prompt: "A learner driver on a UK motorway must be?", choices: ["Banned", "Accompanied by an approved instructor in a dual-control car", "Driving alone if 17", "Only on weekends"], answer: 1, explanation: "Learners may use motorways only with an ADI in a dual-control vehicle." },

  { id: "q86", topic: "traffic", prompt: "A box junction is marked with?", choices: ["Yellow criss-cross lines", "Red diagonal lines", "Solid white lines", "Zigzag white lines"], answer: 0, explanation: "Yellow criss-cross lines mark a box junction — never enter unless your exit is clear." },
  { id: "q87", topic: "traffic", prompt: "Zigzag white lines near a crossing mean?", choices: ["No parking or overtaking", "Bus stop", "Cycle lane", "Loading bay"], answer: 0, explanation: "No parking, no overtaking the lead vehicle approaching the crossing." },
  { id: "q88", topic: "traffic", prompt: "A red 'X' over a motorway lane means?", choices: ["Lane closed — do not use", "Slow vehicles only", "Right-hand drive only", "Overtake to the left"], answer: 0, explanation: "Red X = lane is closed, move out as soon as safe." },
  { id: "q89", topic: "traffic", prompt: "On a dual carriageway the right lane is for?", choices: ["Cruising", "Overtaking only", "HGVs", "Coaches"], answer: 1, explanation: "Even on dual carriageways, the right lane is for overtaking." },
  { id: "q90", topic: "traffic", prompt: "A puffin crossing differs from a pelican because it?", choices: ["Has flashing amber", "Uses sensors to detect pedestrians", "Has zigzag lines", "Always has a beep"], answer: 1, explanation: "Puffins use sensors — no flashing amber stage, lights stay red while pedestrians cross." },
  { id: "q91", topic: "traffic", prompt: "A toucan crossing is shared by?", choices: ["Pedestrians and cyclists", "Pedestrians and horses", "Cars and bikes", "Buses and trams"], answer: 0, explanation: "Toucan = 'two-can' cross — pedestrians and cyclists together." },
  { id: "q92", topic: "traffic", prompt: "Smart motorway gantry shows a green arrow over a lane?", choices: ["Lane is open", "Stop and wait", "Lane closing", "Overtake here"], answer: 0, explanation: "Green arrow = lane open for use." },
  { id: "q93", topic: "traffic", prompt: "If you miss your motorway exit you should?", choices: ["Reverse on the hard shoulder", "Continue to the next exit", "Stop and check the map", "Cross the chevrons quickly"], answer: 1, explanation: "Never reverse — carry on to the next junction and turn back." },
  { id: "q94", topic: "traffic", prompt: "Chevrons painted on the road on a motorway mean?", choices: ["Decorative", "Keep at least two chevrons apart", "Bus lane", "Lane closure"], answer: 1, explanation: "Use chevrons to gauge a safe gap from the vehicle in front." },
  { id: "q95", topic: "traffic", prompt: "On a 3-lane motorway, HGVs over 7.5t must not normally use?", choices: ["Left lane", "Middle lane", "Right lane", "Hard shoulder"], answer: 2, explanation: "HGVs are restricted from the right-most lane on most 3-lane motorways." },
  { id: "q96", topic: "traffic", prompt: "Tram-only routes are marked by?", choices: ["Diamond signs", "Yellow lines", "Solid white kerbs", "Red asphalt"], answer: 0, explanation: "Diamond-shaped signs apply to tram drivers — give them priority." },
  { id: "q97", topic: "traffic", prompt: "If queues form on a motorway, you should switch on?", choices: ["Full beam", "Hazard lights briefly to warn behind", "Fog lights", "Headlights flash"], answer: 1, explanation: "A quick hazard-light flash warns following traffic of slowing ahead." },
  { id: "q98", topic: "traffic", prompt: "On a wet motorway, the safe following gap is?", choices: ["1 second", "2 seconds", "4 seconds", "10 seconds"], answer: 2, explanation: "Double it to 4 seconds in the wet." },
  { id: "q99", topic: "traffic", prompt: "You see a long, slow vehicle ahead on a single road. You should?", choices: ["Overtake immediately", "Stay well back to see ahead", "Tailgate", "Flash lights to make them move"], answer: 1, explanation: "Drop back so you can see oncoming traffic before overtaking." },
  { id: "q100", topic: "traffic", prompt: "What does a yellow box at a junction prevent?", choices: ["Right-turn collisions", "Vehicles blocking the junction", "Pedestrians crossing", "Bus stops"], answer: 1, explanation: "It keeps junctions clear — never enter unless your exit is clear." },

  { id: "q101", topic: "vehicle", prompt: "Brake fluid should be?", choices: ["Topped up every drive", "Between the min and max marks", "Drained yearly", "Mixed with oil"], answer: 1, explanation: "Keep brake fluid between the marks — low level may indicate worn pads or a leak." },
  { id: "q102", topic: "vehicle", prompt: "Coolant top-up should be done?", choices: ["With the engine hot", "Only by a mechanic", "When the engine is cold", "Only when it boils over"], answer: 2, explanation: "Never open a hot radiator cap — wait for it to cool." },
  { id: "q103", topic: "vehicle", prompt: "Tyre sidewall damage means you should?", choices: ["Inflate harder", "Replace the tyre", "Ignore it", "Wrap with tape"], answer: 1, explanation: "Sidewall damage cannot be repaired — replace the tyre." },
  { id: "q104", topic: "vehicle", prompt: "Worn shock absorbers will cause?", choices: ["Better grip", "Longer braking distances and poor cornering", "Improved fuel economy", "Quieter ride"], answer: 1, explanation: "Worn shocks reduce tyre contact and lengthen braking distance." },
  { id: "q105", topic: "vehicle", prompt: "A misaligned steering wheel can mean?", choices: ["Tyre balance issue", "Wheel alignment problem", "Engine misfire", "Faulty wipers"], answer: 1, explanation: "Off-centre steering or pulling to one side usually means alignment is off." },
  { id: "q106", topic: "vehicle", prompt: "You should top up screen wash?", choices: ["Only in winter", "Whenever it's low", "Once a year", "Never"], answer: 1, explanation: "Driving without screen wash is an offence in many jurisdictions." },
  { id: "q107", topic: "vehicle", prompt: "Diesel particulate filters (DPF) need?", choices: ["Frequent stop-start in town", "Regular motorway runs to regenerate", "Daily oil changes", "Replacement weekly"], answer: 1, explanation: "DPFs regenerate at sustained higher speeds — short trips clog them." },
  { id: "q108", topic: "vehicle", prompt: "An amber dashboard warning means?", choices: ["Stop immediately", "Caution — get checked soon", "Safe to ignore", "Service complete"], answer: 1, explanation: "Amber = caution. Red = stop. Green/blue = information." },
  { id: "q109", topic: "vehicle", prompt: "Recommended tyre pressures are usually found?", choices: ["On the tyre itself", "In the door jamb or fuel filler", "On the dashboard", "On the engine cover"], answer: 1, explanation: "Look in the driver's door jamb or fuel-filler flap." },
  { id: "q110", topic: "vehicle", prompt: "Misted windows are best cleared by?", choices: ["Wiping with a cloth", "Air-con + warm air", "Opening the bonnet", "Driving faster"], answer: 1, explanation: "Air-con dries the air; combined with warm flow it clears mist fastest." },
  { id: "q111", topic: "vehicle", prompt: "Excessive exhaust smoke can indicate?", choices: ["Engine problem", "Healthy engine", "Cold weather", "New fuel"], answer: 0, explanation: "Blue/black smoke = engine issue. Get it checked." },
  { id: "q112", topic: "vehicle", prompt: "If the temperature gauge is in the red you should?", choices: ["Carry on slowly", "Stop safely and switch off", "Add cold water immediately", "Rev the engine"], answer: 1, explanation: "Overheating can wreck an engine — pull over and let it cool." },
  { id: "q113", topic: "vehicle", prompt: "Anti-roll bars on a car help to?", choices: ["Stop reversing", "Reduce body roll in corners", "Save fuel", "Improve braking"], answer: 1, explanation: "They link wheels across an axle to reduce lean in corners." },
  { id: "q114", topic: "vehicle", prompt: "ESP / stability control helps by?", choices: ["Cruising on motorways", "Braking individual wheels to prevent skids", "Improving fuel use", "Boosting power"], answer: 1, explanation: "ESP intervenes when it detects loss of grip — keep it switched on." },
  { id: "q115", topic: "vehicle", prompt: "An incorrectly loaded roof rack can?", choices: ["Improve fuel economy", "Affect handling and stability", "Have no effect", "Reduce drag"], answer: 1, explanation: "Roof loads raise the centre of gravity — drive slower, especially in crosswinds." },

  { id: "q116", topic: "hazard", prompt: "Driving in strong crosswinds you should expect?", choices: ["Better fuel economy", "Vehicles being blown sideways, especially HGVs", "Improved grip", "Less braking distance"], answer: 1, explanation: "High-sided vehicles and motorbikes are most affected — give them space." },
  { id: "q117", topic: "hazard", prompt: "Bright sunlight low in the sky is most dangerous because?", choices: ["It dries the road", "It dazzles drivers", "It heats tyres", "It blocks satellites"], answer: 1, explanation: "Use your visor and slow down — other drivers may also be dazzled." },
  { id: "q118", topic: "hazard", prompt: "Following an ambulance you should?", choices: ["Tailgate to get through traffic", "Keep well back", "Use bus lanes too", "Flash your lights"], answer: 1, explanation: "Don't follow emergency vehicles through traffic — keep clear." },
  { id: "q119", topic: "hazard", prompt: "Children playing near parked cars require you to?", choices: ["Sound horn", "Drive slowly and be ready to stop", "Speed up to clear the area", "Use full beam"], answer: 1, explanation: "Children can run out without warning — anticipate it." },
  { id: "q120", topic: "hazard", prompt: "If a tyre bursts at speed you should?", choices: ["Brake hard", "Grip the wheel and ease off the accelerator", "Pull the handbrake", "Switch off engine"], answer: 1, explanation: "Hold the wheel firmly, ease off, and roll to a safe stop." },
  { id: "q121", topic: "hazard", prompt: "On a country road at night you should normally?", choices: ["Use full beam where it won't dazzle others", "Always use dipped beam", "Use only sidelights", "Use fog lights"], answer: 0, explanation: "Use full beam to see further, dipping for oncoming traffic and when following." },
  { id: "q122", topic: "hazard", prompt: "Brake lights of cars far ahead suggest you should?", choices: ["Maintain speed", "Cover the brake and prepare to slow", "Overtake them", "Use cruise control"], answer: 1, explanation: "Scan well ahead — react early to give yourself more room." },
  { id: "q123", topic: "hazard", prompt: "Pedestrians at a junction with prams should be?", choices: ["Hooted at", "Given priority when crossing the side road", "Asked to wait", "Ignored"], answer: 1, explanation: "The Highway Code gives pedestrians crossing a side road priority over turning vehicles." },
  { id: "q124", topic: "hazard", prompt: "After driving through a deep puddle, you should test?", choices: ["Indicators", "Brakes gently", "Horn", "Lights"], answer: 1, explanation: "Wet brakes are weaker — gently press the pedal to dry them out." },
  { id: "q125", topic: "hazard", prompt: "Motorcyclists are most often missed at?", choices: ["Motorway junctions", "Roundabouts and junctions", "Petrol stations", "Bus stops"], answer: 1, explanation: "Most bike collisions happen at junctions — look twice for bikes." },
  { id: "q126", topic: "hazard", prompt: "A vehicle approaching with one headlight could be?", choices: ["A motorcycle", "Always a car with a broken light", "A bicycle", "An emergency vehicle"], answer: 0, explanation: "Treat single headlights as a motorbike until you can confirm." },
  { id: "q127", topic: "hazard", prompt: "On a motorway, debris in your lane requires you to?", choices: ["Swerve sharply", "Check mirrors, slow if safe and report on next call point", "Stop and remove it", "Ignore it"], answer: 1, explanation: "Don't take risks — report hazards via emergency phone or 999." },
  { id: "q128", topic: "hazard", prompt: "A cyclist looks over their right shoulder. They likely intend to?", choices: ["Turn or move right", "Stop", "Brake", "Overtake on the left"], answer: 0, explanation: "Look-back is a typical signal of an upcoming change of position." },
  { id: "q129", topic: "hazard", prompt: "An ice warning light on the dashboard means?", choices: ["Snow ahead", "Outside temperature near freezing — risk of ice", "Engine cold", "Window frosted"], answer: 1, explanation: "Below ~3°C, surfaces (especially bridges) can be icy." },
  { id: "q130", topic: "hazard", prompt: "Tailgating is dangerous because?", choices: ["It wastes fuel", "You have less time to react", "It scratches the car", "It's noisy"], answer: 1, explanation: "Closing the gap removes your reaction time — leave at least 2 seconds." },

  { id: "q131", topic: "road-signs", prompt: "A 'no overtaking' sign is?", signKind: "regulatory", signLabel: "⊘", choices: ["Red ring with two cars side by side", "Blue with one car", "Yellow triangle", "Octagon"], answer: 0, explanation: "Red ring around two cars (one black, one red) = no overtaking." },
  { id: "q132", topic: "road-signs", prompt: "A 'humps' warning sign tells you to expect?", signKind: "warning", signLabel: "⌒⌒", choices: ["Speed bumps", "Hills", "Tunnels", "Roadworks"], answer: 0, explanation: "Traffic-calming humps ahead — slow down." },
  { id: "q133", topic: "road-signs", prompt: "A red triangle showing a snowflake warns of?", signKind: "warning", signLabel: "❄", choices: ["Snowy area", "Risk of ice or snow", "Ski resort", "Cold storage"], answer: 1, explanation: "Be prepared for icy conditions ahead." },
  { id: "q134", topic: "road-signs", prompt: "A blue rectangle with a white bus means?", signKind: "regulatory", signLabel: "🚌", choices: ["Bus lane", "Bus station", "No buses", "Bus stop only"], answer: 0, explanation: "Bus lane sign — check times for when cars may use it." },
  { id: "q135", topic: "road-signs", prompt: "An octagonal red sign with white border means?", signKind: "stop", signLabel: "STOP", choices: ["Stop and give way", "Slow", "End of road", "Detour"], answer: 0, explanation: "Stop sign — you must come to a complete stop before proceeding." },
  { id: "q136", topic: "road-signs", prompt: "A red triangle showing a tram warns of?", signKind: "warning", signLabel: "🚊", choices: ["Trams crossing", "Train station", "Tram-only road", "Bus route"], answer: 0, explanation: "Trams cross or share the road — look carefully." },
  { id: "q137", topic: "road-signs", prompt: "A red triangle with two children running means?", signKind: "warning", signLabel: "🏃", choices: ["School or playground area", "Pedestrians only", "Crossing patrol", "Park exit"], answer: 0, explanation: "Children likely to be on or near the road — slow and watch." },

  { id: "q138", topic: "rules", prompt: "The legal blood-alcohol limit in Scotland is?", choices: ["50 mg/100ml", "80 mg/100ml", "22 mg/100ml", "0 mg/100ml"], answer: 0, explanation: "Scotland's limit is lower than England — 50 mg per 100 ml of blood." },
  { id: "q139", topic: "rules", prompt: "Penalty for driving without insurance can include?", choices: ["Verbal warning", "Fixed penalty plus 6–8 points, fine or unlimited", "Just a fine", "Disqualification only"], answer: 1, explanation: "It's a serious offence — points, fines and possible vehicle seizure." },
  { id: "q140", topic: "rules", prompt: "Drivers must report a medical condition that affects driving to?", choices: ["Insurer only", "DVLA/DVA", "Doctor only", "No one"], answer: 1, explanation: "Notifiable conditions must be declared to the licensing authority." },
  { id: "q141", topic: "rules", prompt: "After a serious crash on a public road, you must?", choices: ["Drive home and call later", "Stop, exchange details and report to police if needed", "Only call insurance", "Ignore if no one is hurt"], answer: 1, explanation: "Always stop, swap details, and report injuries or damage promptly." },
  { id: "q142", topic: "rules", prompt: "Headphones while driving are?", choices: ["Encouraged", "Allowed at low volume", "Strongly discouraged — they reduce awareness", "Required by law"], answer: 2, explanation: "Anything that limits hearing road sounds reduces your safety margin." },

  { id: "q143", topic: "traffic", prompt: "A 'STOP' line at a junction is?", choices: ["A single broken line", "A solid white line across the road", "Yellow zig-zags", "Two parallel dashed lines"], answer: 1, explanation: "Solid white stop line — your vehicle must not cross until safe." },
  { id: "q144", topic: "traffic", prompt: "Give-way lines at a junction are?", choices: ["Solid white", "Double broken white lines across your lane", "Yellow", "Red"], answer: 1, explanation: "Double dashed lines = give way." },
  { id: "q145", topic: "traffic", prompt: "Approaching contraflow roadworks you should?", choices: ["Speed up", "Reduce speed, keep your distance, follow signed limit", "Overtake the lead vehicle", "Use hazard lights"], answer: 1, explanation: "Narrow lanes and two-way traffic — slow, steady and patient." },
  { id: "q146", topic: "traffic", prompt: "An advanced stop line at lights is for?", choices: ["HGVs", "Cyclists", "Buses", "Taxis"], answer: 1, explanation: "Cyclists wait ahead of motor traffic at lights." },
  { id: "q147", topic: "traffic", prompt: "When the green filter arrow shows at lights you may?", choices: ["Go in any direction", "Proceed only in the arrow direction", "Stop", "Reverse"], answer: 1, explanation: "Green arrow = proceed only in that direction, giving way as needed." },

  { id: "q148", topic: "vehicle", prompt: "A blue dashboard light usually indicates?", choices: ["Warning", "Information — e.g. full beam on", "Service due", "Stop now"], answer: 1, explanation: "Blue is informational; full beam is the most common." },
  { id: "q149", topic: "vehicle", prompt: "Power steering becoming heavy could mean?", choices: ["You're going too slow", "A power-steering fluid or belt issue", "Tyres are over-inflated", "Engine is cold"], answer: 1, explanation: "Get it checked — heavy steering is unsafe and worsening." },
  { id: "q150", topic: "vehicle", prompt: "A whining noise when turning at low speed can indicate?", choices: ["Healthy steering", "Low power-steering fluid", "Worn brake pads", "Loose exhaust"], answer: 1, explanation: "Check the fluid level and look for leaks." },
  { id: "q151", topic: "vehicle", prompt: "Headlight aim should be checked when?", choices: ["Carrying heavy loads in the boot", "Once a decade", "Only at MOT", "Never"], answer: 0, explanation: "Heavy loads tip the car back, raising the beam — adjust the headlight level." },
  { id: "q152", topic: "vehicle", prompt: "If your wipers smear, the most likely cause is?", choices: ["Wet weather", "Worn wiper blades or dirty screen", "Wrong fuel", "Hot weather"], answer: 1, explanation: "Replace blades regularly and clean the screen." },

  { id: "q153", topic: "hazard", prompt: "A pedestrian using a white stick with a red band is?", choices: ["Deaf-blind", "Blind", "Partially sighted", "Lost"], answer: 0, explanation: "Red and white = deaf-blind. Give extra time and space." },
  { id: "q154", topic: "hazard", prompt: "An elderly pedestrian at a crossing may need?", choices: ["A horn", "More time — be patient", "To be hurried", "To be ignored"], answer: 1, explanation: "Always allow extra time for older or disabled pedestrians." },
  { id: "q155", topic: "hazard", prompt: "When driving past a parked ice-cream van you should?", choices: ["Maintain speed", "Slow right down — children may run out", "Sound horn", "Overtake quickly"], answer: 1, explanation: "Children may run into the road without looking." },
  { id: "q156", topic: "hazard", prompt: "Driving past a horse rider with a red ribbon on its tail means?", choices: ["The horse kicks", "The horse is for sale", "The rider is new", "Nothing"], answer: 0, explanation: "Red tail ribbon = horse may kick. Give extra space." },
  { id: "q157", topic: "hazard", prompt: "An approaching vehicle is flashing headlights at you. You should?", choices: ["Assume right of way", "Take care — they may be warning you", "Ignore them", "Flash back aggressively"], answer: 1, explanation: "Treat a flash as a 'I am here' signal — proceed only when sure it is safe." },
  { id: "q158", topic: "hazard", prompt: "Driving in heavy snow you should?", choices: ["Use cruise control", "Increase following distance to at least 10 seconds", "Brake hard early", "Use full beam"], answer: 1, explanation: "Stopping distances can be ten times longer on ice and snow." },
  { id: "q159", topic: "hazard", prompt: "When driving past a school at start/end times you should?", choices: ["Use horn", "Drive especially slowly and watch for children", "Maintain speed", "Drive on the pavement"], answer: 1, explanation: "Children and parents are everywhere at school run time — slow and alert." },
  { id: "q160", topic: "hazard", prompt: "If you feel road rage building you should?", choices: ["Confront the other driver", "Take a break, breathe and continue calmly", "Speed up", "Flash and hoot"], answer: 1, explanation: "Calm yourself before continuing — anger increases risk of crashes." },
];

export interface Achievement { id: string; title: string; desc: string; icon: string; check: (s: { drives: number; mocks: number; streak: number; bestMock: number; bestDrive: number }) => boolean; }
export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-drive", title: "First Drive", desc: "Log your first drive", icon: "🚗", check: (s) => s.drives >= 1 },
  { id: "five-drives", title: "Five Down", desc: "Complete 5 drives", icon: "🛣️", check: (s) => s.drives >= 5 },
  { id: "consistent", title: "Consistent Learner", desc: "Reach a 7 day streak", icon: "👑", check: (s) => s.streak >= 7 },
  { id: "scholar", title: "Theory Scholar", desc: "Score 90%+ on a mock test", icon: "🎓", check: (s) => s.bestMock >= 90 },
  { id: "smooth", title: "Smooth Operator", desc: "Drive scoring 9.0+ ", icon: "✨", check: (s) => s.bestDrive >= 9 },
  { id: "test-ready", title: "Test Ready", desc: "Complete 10 mock tests", icon: "🏁", check: (s) => s.mocks >= 10 },
];

export const COMMUNITY = [
  { id: "c1", name: "Mia", text: "passed her test! 🎉", time: "2h ago", likes: 56, comments: 12 },
  { id: "c2", name: "Jake", text: "completed a 50km drive — new personal best! 🔥", time: "5h ago", likes: 24, comments: 5 },
  { id: "c3", name: "Sophie", text: "is on a 15 day streak — keep it up! 👏", time: "1d ago", likes: 18, comments: 3 },
];

// Hazard perception clip — defines when (seconds) the hazard starts developing
// and ends. Higher score when you tap closer to the start of the window.
export interface HazardClip { id: string; title: string; description: string; durationSec: number; windowStart: number; windowEnd: number; scene: "child" | "cyclist" | "junction"; }
export const HAZARD_CLIPS: HazardClip[] = [
  { id: "hc1", title: "Residential street", description: "Watch the parked cars on the left", durationSec: 12, windowStart: 5, windowEnd: 8, scene: "child" },
  { id: "hc2", title: "Country lane", description: "Cyclist around the bend", durationSec: 12, windowStart: 4, windowEnd: 7, scene: "cyclist" },
  { id: "hc3", title: "Town junction", description: "Vehicle emerging from the left", durationSec: 12, windowStart: 6, windowEnd: 9, scene: "junction" },
];
