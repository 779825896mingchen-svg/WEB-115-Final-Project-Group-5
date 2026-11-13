/* opening page */
   const GAME = {
    title: "Survivors",
    subtitle: "A Choice-Based Story Game",
    titleBg: "assets/background/start.png",
    titleMusic: "wood",
    startScene: "prologue",
    saveKey: "mist-creek-save-v1"
  };
   
  /* charaters and img*/
  const CHARS = {
    david: { name: "", color: "#8a5a4a", glyph: "E",
              img: { default: "assets/chars/dog.jpg", smile: "assets/chars/dog.jpg" } },
    person2:   { name: "char2", color: "#4d5d54", glyph: "Z",
              img: { default: "assets/chars/dog.jpg" } }
  };
   
  /* background img and backup background color if img dont load*/
  const BG = {
    start: { file: "assets/background/start.png",  fallback: "linear-gradient(#2b3a35,#0e1411)" },
    town:  { file: "assets/background/town.png",  fallback: "linear-gradient(#2b3a35,#0e1411)" },
    house:  { file: "assets/background/house.png",  fallback: "linear-gradient(#2b3a35,#0e1411)" },
    houseinside:  { file: "assets/background/houseinside.png",  fallback: "linear-gradient(#2b3a35,#0e1411)" },
    hospital:   { file: "assets/background/hospital.png",   fallback: "linear-gradient(#4a2d22,#150d0a)" },
    hospitalinside: { file: "assets/background/hospitalinside.png",   fallback: "linear-gradient(#4a2d22,#150d0a)" },
    store: { file: "assets/background/store.png", fallback: "linear-gradient(#26332f,#070a09 80%)" },
    storeinside: { file: "assets/background/storeinside.png", fallback: "linear-gradient(#26332f,#070a09 80%)"},
    forest: { file: "assets/background/forest.png", fallback: "linear-gradient(#101a2a,#04070b)" }
  };
   
  /* muisc choice*/
  const MUSIC = {
    calm:    "assets/music/calm.mp3",
    tension: "assets/music/tension.mp3",
    main:    "assets/music/297_Survivors_Bivouac.mp3"
  };
   
  /* Stat display names — a popup appears when a stat changes */
  const STATS = { david: "object acquire", person2: "object acquire" };
   
  /* ============================================================
     Story —— This is where you'll mainly write
     Each scene can have:
       bg      Background name (see BG above)
       music   Music name (see MUSIC above); if omitted, stays the same
       chars   [{id:"david", pos:"left|center|right", mood:"smile"}]  if omitted, stays the same; [] clears
       lines   Dialogue array:
                 "Narration text"
                 ["david","Character line"]
                 ["david","Line",{mood:"smile"}]   change expression
       choices Options: { text, goto, set:{david:"+1", sawLight:true}, if:v=>v.david>=1 }
       next    When there are no choices, automatically jump to this scene after playing
       ending  Fill in text to show the ending screen
     ============================================================ */


     // Chapter 1
  const STORY = {
    // background story
    prologue: {
      bg: "town", chars: [], cinematic: true, music: "main",
      lines: [
        "First line of your background story.",
        "Second line.",
        "Third line."
      ],
      next: "house"
    },
    // scene 1
    house: {
      bg: "house", music: "main", chars: [],
      lines: [
        "story line",
        "story line",
        "story line"
      ],
      next: "houseinside"
    },
    // scene 2
    houseinside: {
      bg: "houseinside", chars: [{ id: "david", pos: "left" }], music: "main",
      lines: [
        ["david", "story line"],
        ["david", "story line"],
        "story line"
      ],
      // scene 2 choices
      choices: [
        { text: "「go hospital」", goto: "hospital" },
        { text: "「go store」", goto: "store" }
      ]
    },
    // scene 2 choice 1
    hospital: {
      bg: "hospital", music: "main",
      chars: [{ id: "david", pos: "center", mood: "smile" }],
      lines: [
        ["david", "story line", { mood: "smile" }],
        "story line"
      ],
      next: "hospitalinside"
    },
    // scene 2 choice 2
    store: {
      bg: "store", music: "main",
      lines: [
        ["david", "story line"],
        "story line"
      ],
      next: "storeinside"
    },
    // scene 3 choices
    hospitalinside: {
      bg: "hospitalinside", music: "main", chars: [],
      lines: [
        "story line",
        "story line"
      ],
      choices: [
        { text: "story line", goto: "highway", set: { sawLight: true } },
        { text: "story line", goto: "gowood" }
      ]
    },

    storeinside: {
      bg: "storeinside", music: "main", chars: [{ id: "person2", pos: "right" }],
      lines: [
        "story line",
        ["char2", "story line"],
        ["char2", "story line"]
      ],
      choices: [
        { text: "「story line」", goto: "highway", set: { person2: "object +1" } },
        { text: "「story line」", goto: "forest" }
      ]
    },
    forest: {
      bg: "forest", chars: [],
      lines: ["story line", "story line"],
      next: "end_leave"
    },
    highway: {
      chars: [{ id: "person2", pos: "center" }],
      lines: [["char2", "story line"]],
      ending: "Chapter 1 End"
    },
    end_leave: {
      chars: [],
      lines: ["story line"],
      ending: "Chapter 2 End"
    }
  };
   