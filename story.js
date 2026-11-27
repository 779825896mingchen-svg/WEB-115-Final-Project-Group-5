/* opening page */
const GAME = {
  title: "Survivors",
  subtitle: "A Choice-Based Story Game",
  titleBg: "assets/background/start.png",
  titleMusic: "wood",
  startScene: "prologue",
  saveKey: "mist-creek-save-v1"
};

/* characters and images */
const CHARS = {
  david: { name: "${playerName}", color: "#8a5a4a", glyph: "D",
           img: { default: "assets/chars/david.png", smile: "assets/chars/david.png" } },
  asha:  { name: "Asha",  color: "#4d5d54", glyph: "A",
           img: { default: "assets/chars/asha.png" } },
  guard: { name: "Guard", color: "#5a5a4a", glyph: "G",
           img: { default: "assets/chars/guard.png" } },
  scavenger: { name: "scavenger", color: "#5a4a3a", glyph: "S",
    img: { default: "assets/chars/scavenger.png" } }
};

/* background images + fallback color if image doesn't load */
const BG = {
  start:          { file: "assets/background/start.png",          fallback: "linear-gradient(#2b3a35,#0e1411)" },
  town:           { file: "assets/background/townp.png",           fallback: "linear-gradient(#2b3a35,#0e1411)" },
  house:          { file: "assets/background/house.png",          fallback: "linear-gradient(#2b3a35,#0e1411)" },
  houseinside:    { file: "assets/background/houseinside.png",    fallback: "linear-gradient(#2b3a35,#0e1411)" },
  hospital:       { file: "assets/background/hospital.png",       fallback: "linear-gradient(#4a2d22,#150d0a)" },
  hospitalinside: { file: "assets/background/hospitalinside.png", fallback: "linear-gradient(#4a2d22,#150d0a)" },
  store:          { file: "assets/background/store_exterior.png",          fallback: "linear-gradient(#26332f,#070a09 80%)" },
  storeinside:    { file: "assets/background/store_interior.png",    fallback: "linear-gradient(#26332f,#070a09 80%)" },
  forest:         { file: "assets/background/forest.png",         fallback: "linear-gradient(#101a2a,#04070b)" },
  highway:        { file: "assets/background/highway.png",        fallback: "linear-gradient(#3a3a3a,#0c0c0c)" },
  roadchoice:        { file: "assets/background/roadchoice.png",        fallback: "linear-gradient(#3a3a3a,#0c0c0c)" },
  haven:          { file: "assets/background/haven.png",          fallback: "linear-gradient(#2e3b2a,#0a100a)" },
  haveninside:          { file: "assets/background/haveninside.png",          fallback: "linear-gradient(#2e3b2a,#0a100a)" },
  haveninside2:          { file: "assets/background/haveninside2.png",          fallback: "linear-gradient(#2e3b2a,#0a100a)" },
  havenoutside:          { file: "assets/background/havenoutside.png",          fallback: "linear-gradient(#2e3b2a,#0a100a)" }
};

/* music */
const MUSIC = {
  calm:    "assets/music/208_Ghost_Town.mp3",
  tension: "assets/music/haven.mp3",
  main:    "assets/music/297_Survivors_Bivouac.mp3"
};

/* Stat names shown in the popup / ending screen */
const STATS = { supplies: "Supplies", info: "Info" };

/* item that show in backpack on the right top corner */
const ITEMS = {
  medkit: { name: "Medical Supplies", img: "assets/item/medkit.png", desc: "Bandages and antiseptic." },
  food:   { name: "Food & Water",     img: "assets/item/food.png",   desc: "Enough for a few days." },
  radio:  { name: "Radio",            img: "assets/item/radio.png",  desc: "Hand-crank. Repeats the Haven broadcast." },
  knife:  { name: "Knife",            img: "assets/item/knife.png",  desc: "Old but sharp. Better than empty hands." }
};

/* ============================================================
   Scene options:
     bg, music, chars, lines, next, ending
     choices: [{ text, goto, set:{supplies:"+1"}, if:v=>... }]
     branch:  [{ if:v=>..., goto }]  -> automatic jump, first match wins
              (leave "if" off the last one as the default)

   Variables used:
     supplies  +1 from store (-1 if you fight the roadblock)
     info      +1 from hospital radio, survivor, or old map
     ally      true if you helped the survivor
   ============================================================ */

const STORY = {

  /* ================= CHAPTER 1 : The City ================= */
  prologue: {
    bg: "town", chars: [], cinematic: true, music: "main",
    lines: [
      "The mist came down off the hills on one day, and nothing that walked into it came out alive.",
      "Three weeks later, Mist Creek is quiet. Not peaceful. Quiet — the kind that listens back.",
      "You are David. The town is quiet in a way that doesn't feel like sleep. You have no supplies, no answers, and no one to ask."
    ],
    next: "house"
  },
  house: {
    bg: "house", music: "main", chars: [],
    lines: [
      "Your house. The front door is still unlocked — you never came back to lock it.",
      "Inside: a cold cup of coffee you never finished. A dead phone. The photo on the fridge, turned face-down.",
      "Take what you can carry. You won't be coming back."
    ],
    next: "houseinside"
  },
  houseinside: {
    bg: "houseinside", chars: [{ id: "david", pos: "left" }], give: ["radio", "knife"],
    lines: [
      ["david", "Car's dead. Phone's dead. Whole town's dead and nobody told it."],
      "In the kitchen drawer, under a pile of dead batteries, he finds a knife. Old, but the edge still holds.",
      "On the shelf, an old hand-crank radio. He turns the handle without really thinking about it.",
      "Static. Then, under the hiss, a voice, thin and tired, repeating itself.",
      "\"...to anyone still out there. There is a settlement. Haven. We have walls, food, and medicine.\"",
      "\"Come north. Bring what you can carry. Haven is open to anyone who makes it to the gate.\"",
      ["david", "Haven... So there's somewhere left to go."],
      ["david", "But I can't walk that far with empty hands. One trip before dark. Medicine, or food?"],
      "Hospital on Fifth, or the market on Main. The choice is small. It won't stay small."
    ],
    set: { haven: true },
    choices: [
      { text: "[ Go to the hospital ]",      goto: "hospital", set: { supplies: "+1", info: "+1" } },
      { text: "[ Go to the grocery store ]", goto: "store",    set: { supplies: "+1", info: "+1" } }
    ]
  },

  // --- Path A: Hospital ---
  hospital: {
    bg: "hospital", chars: [{ id: "david", pos: "center", mood: "smile" }], 
    lines: [
      ["david", "Fifth Street. Still standing. That's more than most of this town can say.", { mood: "smile" }],
      "The doors are jammed half-open. Something inside is humming — a generator, or a machine that doesn't know everyone's dead."
    ],
    next: "hospitalinside"
  },
  hospitalinside: {
    bg: "hospitalinside", chars: [], give: ["medkit"],  
    lines: [
      "The corridors smell of antiseptic and old blood. Gurneys line the walls like abandoned shopping carts.",
      "You find a supply closet — bandages, antiseptic, painkillers. You take what fits in the bag.",
      "Then a voice. Not live. A radio on the desk, looping: '...Haven is real. North road, past the ridge. Bring proof you can contribute. Haven is real...'"
    ],
    choices: [
      { text: "[ Take the medkit ]", goto: "leaveCity", set: { supplies: "+1" } }
    ]
  },

  // --- Path B: Grocery store ---
  store: {
    bg: "store", chars: [{ id: "david", pos: "left" }],
    lines: [
      ["david", "Main Street Market. Windows are gone. Shelves might not be."],
      "A shopping cart lies on its side in the doorway. Someone left in a hurry. Someone might still be inside."
    ],
    next: "storeinside"
  },
  storeinside: {
    bg: "storeinside", chars: [], 
    lines: [
      "Canned goods. Bottled water. A dented box of matches. You fill the bag until the strap bites your shoulder.",
      "Behind you, a floorboard creaks. You are not the only one who knows about this store."
    ],
    next: "scavengers"
  },
  scavengers: {
    bg: "storeinside", chars: [{ id: "scavenger", pos: "right" }],
    lines: [
      "A figure in a hooded coat steps out from behind the last aisle. A length of pipe hangs loose in one hand, casual, the way people hold things they've used before.",
      ["scavenger", "That's my store. Everything on those shelves is mine."],
      ["scavenger", "You want to walk out of here, you put the bag down. Or you don't walk out."]
    ],
    choices: [
      { text: "[ Escape with the food ]", goto: "leaveCity", give: "food", set: { supplies: "+1" } },
      { text: "[ Hand over the bag ]",    goto: "leaveCity" }
    ]
  },

  // --- How do you leave the city? ---
  leaveCity: {
    bg: "roadchoice", chars: [],
    lines: [
      "The edge of town. The mist thins here, but it never lifts. Two roads go north: the highway, straight and open — and the forest, slow and green.",
      "Open roads get watched. Green roads get lost. Either way, you have until dark."
    ],
    choices: [
      { text: "[ Take the highway ]",      goto: "highway" },
      { text: "[ Go through the forest ]", goto: "forest" }
    ]
  },

  /* ================= CHAPTER 2 : The Road ================= */

  // --- Highway ---
  highway: {
    bg: "highway", chars: [],
    lines: [
      "The highway is a graveyard of cars, nose to tail, all pointed the same direction. None of them got far.",
      "Half a mile on, a barricade of burned trucks blocks the lanes. Figures move behind it. They've seen you.",
      "One of them raises a hand. Not a wave — a signal. They want you to come closer."
    ],
    choices: [
      { text: "[ Sneak around ]",  goto: "roadSneak" },
      { text: "[ Confront them ]", goto: "roadFight", set: { supplies: "-1" }, take: "knife" }
    ]
  },
  roadSneak: {
    bg: "highway", chars: [],
    lines: [
      "You drop off the shoulder into the drainage ditch and follow it east on your belly until the barricade is a smudge behind you.",
      "It costs you an hour and a scraped arm. It costs you nothing else."
    ],
    next: "toHaven"
  },
  roadFight: {
    bg: "highway", chars: [{ id: "asha", pos: "center" }],
    lines: [
      ["asha", "You picked the wrong road, friend."],
      "It's over fast and ugly. You get through — but your bag doesn't. Food, matches, half your water, gone in the scuffle.",
      "Someone wrenches the knife from your belt before you can draw it. You never see it again.",
      "You limp north with a split lip and a lesson: some roads charge a toll."
    ],
    next: "toHaven"
  },

  // --- Forest ---
  forest: {
    bg: "forest", chars: [{ id: "asha", pos: "right" }],
    lines: [
      "The forest swallows the road within a hundred paces. Birdsong. Wind. Your own footsteps, too loud.",
      ["asha", "Help — please — I can't — my leg —"],
      "A woman is propped against a pine, a tourniquet of torn shirt around her thigh. Her eyes are clear. She isn't one of them yet."
    ],
    choices: [
      { text: "[ Help the survivor ]", goto: "forestHelp", set: { ally: true } },
      { text: "[ Continue alone ]",    goto: "forestAlone" }
    ]
  },
  forestHelp: {
    bg: "forest", chars: [{ id: "asha", pos: "right" }],
    lines: [
      ["asha", "Thank you. Thank you — I thought I was going to die out here alone."],
      ["asha", "There's a place north of the ridge. Haven. Walled, guarded, real. Show them you're worth something and they'll take you in."],
      "She draws a map in the dirt with a stick. You memorize it. When you look up, she's already asleep — or something like it."
    ],
    choices: [
      { text: "[ Head toward Haven ]", goto: "toHaven", set: { info: "+1" } }
    ]
  },
  forestAlone: {
    bg: "forest", chars: [],
    lines: [
      "You walk until the light goes grey. In the hollow of a fallen oak, half-buried in leaves, there's a canvas satchel — and inside it, a map.",
      "Someone drew it by hand. A ridge, a river, and at the end of a dotted line, circled twice: HAVEN."
    ],
    choices: [
      { text: "[ Follow the map ]", goto: "toHaven", set: { info: "+1" } }
    ]
  },

  // --- Travel (all paths merge) ---
  toHaven: {
    bg: "haven", music: "tension", chars: [],
    lines: [
      "You walk through the night. The mist thickens, thins, thickens again. Somewhere behind you a branch breaks. You don't turn around.",
      "By dawn the trees are thinner and the ground runs uphill. You can smell woodsmoke.",
      "Then: a wall. Twelve feet of timber and wire. A gate. A light on top of it, still on."
    ],
    next: "havenGate"
  },

  /* ================= CHAPTER 3 : Haven ================= */
  havenGate: {
    bg: "haven", chars: [{ id: "guard", pos: "center" }],
    lines: [
      "A voice comes down from the wall. 'That's far enough. Name and business.'",
      "'Haven doesn't take everyone,' it says. 'Fifty mouths, forty beds. So tell me why you're not just another mouth.'",
      "The gate stays shut. The light stays on you."
    ],
    choices: [
      { text: "[ Show proof ]",  goto: "proof" },
      { text: "[ Force entry ]", goto: "force" }
    ]
  },

  // --- Show proof: accepted if supplies + info >= 2 ---
  proof: {
    bg: "haven", chars: [{ id: "guard", pos: "center" }],
    lines: [
      ["guard", "Supplies and information, is it? Everyone says that. Show me."],
      ["david", "Medicine. Water. And I know about the north road — the part that moves after dark."],
      "The guard is talking to someone through radio for a long moment. Then the gate begins to move."
    ],
    branch: [
      { if: v => (v.supplies || 0) + (v.info || 0) >= 2, goto: "ending1" },
      { goto: "ending2" }
    ]
  },

  // --- Force entry: succeeds only if you have an ally ---
  force: {
    bg: "haven", chars: [],
    lines: [
      "You don't answer. You walk to the gate and put your shoulder against it. The wood groans.",
      "Boots on the walkway. A rifle bolt, unmistakable. Someone is shouting for the light to be brought down.",
      "Then a voice cuts through the noise — and you can't tell yet whether it's for you or against you."
    ],
    branch: [
      { if: v => v.ally === true, goto: "ending2" },
      { goto: "ending3" }
    ]
  },

  /* ================= ENDINGS ================= */
  ending1: {
    bg: "haveninside", chars: [],
    lines: [
      "The gate swings open. Inside there are gardens — real ones, turned earth and green shoots, a woman teaching a child to hold a hoe.",
      "They give you a bed, a meal, and a job. You sleep fourteen hours and wake to the sound of someone laughing.",
      "Haven isn't paradise. But it's a place where the future is still a question, and not a countdown."
    ],
    ending: "Ending 1: A New Beginning"
  },
  ending2: {
    bg: "haveninside3", chars: [],
    lines: [
      "They let you in. They don't let you forget it — the guard's eyes follow you across the yard for a week.",
      "Worst bunk, heaviest shift, smallest ration. It's still a roof. It's still a wall between you and the mist.",
      "Somewhere out there, someone paid for your seat at this table. You try not to think about who."
    ],
    ending: "Ending 2: Survival at a Cost"
  },
  ending3: {
    bg: "havenoutside", chars: [],
    lines: [
      "The gate doesn't open. The light goes out. The voice on the wall says 'Move along,' and doesn't say it twice.",
      "You walk back into the trees with the last of your water and the taste of copper in your mouth.",
      "There's another ridge past this one. Another road. Somewhere, a place that isn't Haven. You start walking — it's the only thing left you know how to do."
    ],
    ending: "Ending 3: The Final Journey"
  }
};