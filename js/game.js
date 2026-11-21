class PlayerStats {
  constructor() {
    this.health = 100;
    this.score = 0;
    this.inventory = [];
  }
}

class StoryScene {
  constructor(name, title, text, image) {
    this.name = name;
    this.title = title;
    this.text = text;
    this.image = image;
  }
}

class JournalEntry {
  constructor(text) {
    this.text = text;
  }
}

var health = 100;
var score = 0;
var inventory = ["Food", "Water", "Flashlight", "First-aid kit"];
var journal = [];
var helpedSurvivor = false;
var hasHavenInformation = false;
var hasSupplies = true;
var hasMap = false;
var heardRoadblockWarning = false;
var openedCabinet = false;
var currentScene = "start";
var playerStats = new PlayerStats();
var sceneInfo;
var countdownSeconds = 30;
var countdownTimer;
var storyDelay;
var soundEnabled = false;
var savedSoundPreference = false;
var soundIsPlaying = false;
var selectedChoice = -1;
var ambienceAudio = new Audio("https://sfxmint.com/dl/city-night-ambience-01.mp3");
ambienceAudio.loop = true;
ambienceAudio.volume = 0.15;

var sceneTitle = document.getElementById("title");
var sceneLabel = document.getElementById("scene-kicker");
var sceneText = document.getElementById("story-text");
var choiceList = document.getElementById("choices");
var healthValue = document.getElementById("health");
var scoreValue = document.getElementById("score");
var inventoryList = document.getElementById("inventory");
var journalList = document.getElementById("journal");
var restartButton = document.getElementById("restart");
var sceneImage = document.getElementById("scene-image");
var notice = document.getElementById("notice");
var countdownLabel = document.getElementById("countdown");
var soundNotice = document.getElementById("sound-notice");
var codeForm = document.getElementById("code-form");
var codeInput = document.getElementById("code-input");
var codeMessage = document.getElementById("code-message");
var imageTip = document.getElementById("image-tip");
var soundButton = document.getElementById("sound-toggle");
var saveButton = document.getElementById("save");
var loadButton = document.getElementById("load");

function setSceneImage(imageFile, imageDescription) {
  sceneImage.src = imageFile;
  sceneImage.alt = imageDescription;
}

function addChoiceButton(buttonText, nextScene, effect) {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "choice";
  button.textContent = buttonText;
  button.addEventListener("click", function () {
    applyEffect(effect);
    addJournalEntry(buttonText);
    showScene(nextScene);
  });
  choiceList.appendChild(button);
}

function applyEffect(effect) {
  var oldHealth = health;
  var oldInventory = inventory.slice();
  if (effect === "hospital") {
    inventory.push("Bandages");
    inventory.push("Pain medication");
    inventory.push("Medical supplies");
    hasSupplies = true;
    hasHavenInformation = true;
    score = score + 1;
  }
  if (effect === "grocery") {
    inventory.push("Canned food");
    inventory.push("Bottled water");
    inventory.push("Spare backpack");
    hasSupplies = true;
    score = score + 1;
  }
  if (effect === "negotiate") {
    score = score + 1;
  }
  if (effect === "run") {
    health = health - 5;
  }
  if (effect === "sneak") {
    health = health - 5;
    score = score + 1;
  }
  if (effect === "confront") {
    health = health - 25;
    hasHavenInformation = true;
    heardRoadblockWarning = true;
  }
  if (effect === "stand") {
    health = health - 15;
  }
  if (effect === "help") {
    helpedSurvivor = true;
    hasHavenInformation = true;
    score = score + 2;
  }
  if (effect === "alone") {
    hasHavenInformation = true;
    hasMap = true;
    inventory.push("Hand-drawn map to Haven");
  }
  if (effect === "force") {
    health = health - 20;
  }
  if (effect === "late") {
    health = health - 10;
  }
  if (effect === "cost") {
    inventory = ["A few personal items"];
    hasSupplies = false;
  }
  if (health < 0) health = 0;
  updateNotice(oldHealth, oldInventory);
  updateDashboard();
}

function updateNotice(oldHealth, oldInventory) {
  var changes = [];
  var i;
  var j;
  var found;

  for (i = 0; i < inventory.length; i = i + 1) {
    found = false;
    for (j = 0; j < oldInventory.length; j = j + 1) {
      if (inventory[i] === oldInventory[j]) found = true;
    }
    if (!found) {
      changes.push("+ " + inventory[i]);
    }
  }
  for (i = 0; i < oldInventory.length; i = i + 1) {
    found = false;
    for (j = 0; j < inventory.length; j = j + 1) {
      if (oldInventory[i] === inventory[j]) found = true;
    }
    if (!found) {
      changes.push("− " + oldInventory[i]);
    }
  }
  if (health > oldHealth) changes.push("+ " + (health - oldHealth) + " health");
  if (health < oldHealth) changes.push("− " + (oldHealth - health) + " health");

  if (changes.length === 0) changes.push("No items or health changed.");
  notice.textContent = changes.join("\n");
  notice.hidden = false;
}

function addJournalEntry(entryText) {
  journal.push(new JournalEntry(entryText));
  updateJournal();
}

function updateJournal() {
  journalList.innerHTML = "";
  if (journal.length === 0) {
    journalList.innerHTML = "<p>Your journey notes will appear here.</p>";
  } else {
    var i;
    for (i = 0; i < journal.length; i = i + 1) {
      var item = document.createElement("p");
      item.textContent = journal[i].text;
      journalList.appendChild(item);
    }
  }
}

function updateDashboard() {
  playerStats.health = health;
  playerStats.score = score;
  playerStats.inventory = inventory.slice();
  healthValue.textContent = health;
  scoreValue.textContent = score;
  inventoryList.innerHTML = "";
  if (inventory.length === 0) {
    inventoryList.innerHTML = "<li>Empty</li>";
  } else {
    var i;
    for (i = 0; i < inventory.length; i = i + 1) {
      var item = document.createElement("li");
      item.textContent = inventory[i];
      inventoryList.appendChild(item);
    }
  }
}

function showScene(sceneName) {
  currentScene = sceneName;
  clearInterval(countdownTimer);
  clearTimeout(storyDelay);
  countdownLabel.textContent = "";
  codeForm.hidden = sceneName !== "hospital";
  choiceList.innerHTML = "";
  selectedChoice = -1;
  sceneLabel.textContent = "Your journey";

  if (sceneName === "start") {
    setSceneImage("assets/haven-city.jpg", "A lone traveler with a backpack looks toward a ruined city.");
    sceneTitle.textContent = "Waking Up";
    sceneText.textContent = "The world as people knew it is gone. Cities have been abandoned, governments have fallen, and the remaining survivors struggle to find food, water, and shelter.\n\nYou are one of the few people still alive. After months surviving on your own, you wake on the floor of an abandoned apartment building. Dust covers the furniture, the windows are broken, and the streets below are silent.\n\nYour backpack holds a little food, one bottle of water, a flashlight, and a nearly empty first-aid kit.\n\nYou turn on an old handheld radio. Static breaks into a repeating message from Haven, a settlement promising food, shelter, protection, and a chance to start over.\n\nRadio transmission:\n\"Attention, survivors. This is Haven. We are a secure settlement offering food, shelter, and protection. Follow the northern highway. Repeat, follow the northern highway. Haven is accepting survivors.\"\n\nThe message repeats with exactly the same words. You wonder if it is a recording and whether Haven is truly safe. The sun is beginning to set. Find supplies before you leave the city.";
    addChoiceButton("Search the abandoned hospital", "hospital", "hospital");
    addChoiceButton("Search the grocery store", "grocery", "grocery");
  } else if (sceneName === "hospital") {
    if (openedCabinet) {
      codeMessage.textContent = "The cabinet has already been opened.";
      codeInput.disabled = true;
      codeForm.querySelector("button").disabled = true;
    } else {
      codeMessage.textContent = "";
      codeInput.disabled = false;
      codeForm.querySelector("button").disabled = false;
    }
    setSceneImage("assets/hospital.jpg", "An abandoned hospital corridor lit by sunlight.");
    sceneTitle.textContent = "Finding Supplies: The Hospital";
    sceneText.textContent = "You make your way to the old city hospital. Debris partly blocks the entrance, but you squeeze through a broken window. Inside, the building is dark and silent. Medical equipment is scattered across the floor. In the emergency room, you find bandages, pain medication, and other useful supplies.\n\nA locked supply cabinet has a keypad. A note beside it reads, 'Emergency room code: 472.'\n\nAt the nurses' station, a radio still has power. You turn the dial and hear a faint conversation.\n\nRadio transmission:\n\"Don't go to Haven. I repeat, do not follow the signal. They're not telling you what happens after you arrive.\"\n\nBefore you can hear more, the radio cuts out. You have medical supplies, but more questions than answers.";
    addChoiceButton("Continue to the intersection", "chooseRoute", "none");
  } else if (sceneName === "grocery") {
    setSceneImage("assets/grocery.jpg", "A dark, empty grocery store aisle with an abandoned shopping cart.");
    sceneTitle.textContent = "The grocery store";
    sceneText.textContent = "You head toward the grocery store across town. The windows are smashed, and most of the shelves are empty. You find a few cans of food, bottled water, and a backpack someone left behind.\n\nAs you put the supplies away, you hear footsteps. A voice comes from the back of the store.\n\nStranger:\n\"Drop the bag. Everything in here belongs to us.\"\n\nThree survivors step out from behind the shelves. They are armed, exhausted, and clearly not interested in sharing. You have to decide what to do.";
    addChoiceButton("Try to negotiate", "chooseRoute", "negotiate");
    addChoiceButton("Run for the exit", "chooseRoute", "run");
    addChoiceButton("Stand your ground", "chooseRoute", "stand");
  } else if (sceneName === "chooseRoute") {
    setSceneImage("assets/ending-journey.jpg", "An empty road passes abandoned city buildings.");
    sceneTitle.textContent = "Choosing a Route";
    sceneText.textContent = "After gathering what you can, you leave the city. At an intersection, the highway leads north toward Haven. An old forest road branches east. The radio signal grows stronger when you face the highway, but you remember the warning from the hospital. Your supplies are limited, and there is no time to waste.";
    addChoiceButton("Take the highway", "roadblock", "none");
    addChoiceButton("Travel through the forest", "survivor", "none");
  } else if (sceneName === "roadblock") {
    setSceneImage("assets/roadblock.jpg", "Damaged cars and debris block a highway.");
    sceneTitle.textContent = "The roadblock";
    sceneText.textContent = "Several abandoned vehicles and makeshift barricades block the highway. As you approach a checkpoint, you notice movement between the cars. Someone is watching you.\n\nYou move closer carefully. Armed survivors stand behind the vehicles. One steps forward.\n\nRoadblock survivor:\n\"That's far enough. Nobody gets through here without giving something up.\"\n\nSome of the people behind the leader look frightened rather than aggressive. They may not all agree with what is happening.";
    addChoiceButton("Sneak around the roadblock", "roadToHaven", "sneak");
    addChoiceButton("Confront the group", "roadToHaven", "confront");
  } else if (sceneName === "survivor") {
    setSceneImage("assets/survivor.jpg", "An injured hiker sits on a rocky trail and calls for help.");
    sceneTitle.textContent = "An injured survivor";
    sceneText.textContent = "The forest gives you cover from anyone watching the roads, but the journey is slower. After several hours, you hear someone calling for help. You follow the sound and find an injured survivor beside a fallen tree. They sit holding their side.\n\nInjured survivor:\n\"Please... I need some help. I've been out here for two days.\"\n\nA small backpack rests beside them. They look exhausted and frightened. When you ask where they came from, they answer:\n\nInjured survivor:\n\"I came from Haven. I escaped a few days ago. You don't want to go there.\"\n\nYou have finally met someone who claims to have been inside the settlement.";
    addChoiceButton("Help the survivor", "roadToHaven", "help");
    addChoiceButton("Continue alone", "roadToHaven", "alone");
  } else if (sceneName === "roadToHaven") {
    setSceneImage("assets/haven-gate.jpg", "Makeshift homes form a settlement in a ruined city.");
    sceneTitle.textContent = "The Road to Haven";
    sceneText.textContent = "After days of traveling, you finally see the settlement in the distance. Haven. Tall walls surround it. Watchtowers rise above the gates, and smoke lifts from buildings inside. It looks like the kind of place people would do anything to reach.\n\nYour radio suddenly turns on.\n\nRadio transmission:\n\"Welcome to Haven. You have reached the final checkpoint. Approach the main gate and wait for instructions.\"";
    if (helpedSurvivor) {
      sceneText.textContent = sceneText.textContent + "\n\nAlex stops walking.\n\nAlex:\n\"Something isn't right. I told you I escaped from here. Whatever you do, don't let them separate us.\"";
    } else {
      sceneText.textContent = sceneText.textContent + "\n\nYou remember the warnings from the hospital and the people you met along the way. Reaching Haven may be the easiest part of this journey.";
    }
    if (heardRoadblockWarning) {
      sceneText.textContent = sceneText.textContent + "\n\nA survivor from the roadblock comes to mind. Before you left, they pulled you aside.\n\nSurvivor:\n\"You're looking for Haven, aren't you? People have been disappearing after following that signal.\"";
    }
    addChoiceButton("Approach the main gate", "havenGate", "none");
  } else if (sceneName === "havenGate") {
    setSceneImage("assets/haven-gate.jpg", "Makeshift homes form a settlement in a ruined city.");
    sceneTitle.textContent = "The Gates of Haven";
    sceneText.textContent = "You approach the main gate. Two guards step forward with weapons raised.\n\nGuard:\n\"Stop right there. Identify yourself. Where did you come from?\"\n\nYou explain that you heard the broadcast and crossed the city to reach Haven. The guards inspect your supplies.";
    if (helpedSurvivor) {
      sceneText.textContent = sceneText.textContent + " One guard recognizes Alex and raises a hand.\n\nGuard:\n\"Where did you find that person? They are not authorized to be here.\"\n\nThe guard signals to someone inside. You hear machinery start up.";
    }
    sceneText.textContent = sceneText.textContent + "\n\nYou have to decide what to do.";
    addChoiceButton("Ask to enter peacefully", "peacefulResult", "none");
    addChoiceButton("Try to force your way inside", "forceResult", "force");
  } else if (sceneName === "peacefulResult") {
    setSceneImage("assets/peaceful-entry.jpg", "A quiet village glows beneath a starry sky.");
    sceneTitle.textContent = "The request to enter";
    if (health >= 50 && hasHavenInformation && (hasSupplies || helpedSurvivor || hasMap)) {
      sceneText.textContent = "You explain your journey and offer what you have learned. Your medical supplies, map, warning, or Alex's account gives the guards a reason to listen. They discuss your case. At last, the gates begin to open.\n\nInside, Haven is a real, functioning settlement. But you learn that the radio signal has also been used to screen new arrivals and keep certain information hidden. You have survived and found a place to call home, but the mystery is not completely resolved.";
      addChoiceButton("Enter Haven", "endingNewBeginning", "none");
    } else {
      sceneText.textContent = "The guards listen, but your evidence is incomplete or you are too exhausted to convince them. They refuse entry and demand most of your remaining possessions. With little strength left, you agree. The gates finally open, and you are allowed inside under watch.";
      addChoiceButton("Accept their terms", "endingSurvivalCost", "cost");
    }
  } else if (sceneName === "forceResult") {
    setSceneImage("assets/force-entry.jpg", "Road barriers block a city street.");
    sceneTitle.textContent = "The gate encounter";
    sceneText.textContent = "You rush the gate. An alarm sounds, and more armed survivors appear along the walls.";
    if (health >= 35) {
      sceneText.textContent = sceneText.textContent + "\n\nYou make it through, but the guards overpower you and take most of your supplies before allowing you inside.";
      addChoiceButton("Continue", "endingSurvivalCost", "cost");
    } else {
      sceneText.textContent = sceneText.textContent + "\n\nYou are too injured and exhausted to keep fighting. The guards overpower you before you can get through.";
      addChoiceButton("Continue", "endingFinalJourney", "none");
    }
  } else if (sceneName === "endingNewBeginning") {
    setSceneImage("assets/ending-beginning.jpg", "Sunrise shines over a camp of tents.");
    showEnding("A New Beginning", "Haven is a functioning settlement, and you are accepted inside. You learn that the radio broadcast was being used to screen incoming survivors and keep certain information hidden. You have a place to call home, but Haven's full story remains a mystery.");
  } else if (sceneName === "endingSurvivalCost") {
    setSceneImage("assets/ending-cost.jpg", "A family shelters together in an underground refuge.");
    showEnding("Survival at a Cost", "You reach Haven, but arrive injured, short on supplies, or without an ally. The guards let you inside after taking most of your possessions. As the gates close, a familiar radio message plays from somewhere inside:\n\n\"Attention, survivors. Haven is accepting new arrivals.\"\n\nYou realize the message is still being broadcast, even though you are already inside.");
  } else if (sceneName === "endingFinalJourney") {
    setSceneImage("assets/ending-journey.jpg", "An empty road passes abandoned city buildings.");
    showEnding("The Final Journey", "The journey has left you too injured and exhausted to continue. The guards overpower you before you can enter Haven. As the world fades away, the radio crackles one final time:\n\n\"Attention, survivors. This is Haven. We are a secure settlement offering food, shelter, and protection.\"\n\nThe transmission repeats, waiting for the next desperate survivor to hear it.");
  }
  sceneInfo = new StoryScene(sceneName, sceneTitle.textContent, sceneText.textContent, sceneImage.src);
  if (sceneName === "chooseRoute") startCountdown();
  if (sceneName === "survivor") {
    storyDelay = setTimeout(function () {
      sceneText.textContent = sceneText.textContent + "\n\nA distant howl rolls through the trees. You should keep moving.";
    }, 2500);
  }
  updateDashboard();
}

function showEnding(endingTitle, endingText) {
  sceneLabel.textContent = "Journey complete";
  sceneTitle.textContent = endingTitle;
  sceneText.textContent = endingText;
  addJournalEntry("Ending reached: " + endingTitle);
}

function startCountdown() {
  countdownSeconds = 30;
  countdownLabel.textContent = "Choose a route before the light fades: " + countdownSeconds;
  countdownTimer = setInterval(function () {
    countdownSeconds = countdownSeconds - 1;
    countdownLabel.textContent = "Choose a route before the light fades: " + countdownSeconds;
    if (countdownSeconds <= 0) {
      clearInterval(countdownTimer);
      applyEffect("late");
      countdownLabel.textContent = "The delay costs you 10 health.";
      addJournalEntry("Lost time at the intersection and 10 health.");
    }
  }, 1000);
}

function saveGame() {
  var journalText = [];
  var i;
  for (i = 0; i < journal.length; i = i + 1) {
    journalText.push(journal[i].text);
  }
  var saveData = {
    player: playerStats,
    journal: journalText,
    scene: sceneInfo.name,
    helpedSurvivor: helpedSurvivor,
    hasHavenInformation: hasHavenInformation,
    hasSupplies: hasSupplies,
    hasMap: hasMap,
    heardRoadblockWarning: heardRoadblockWarning,
    openedCabinet: openedCabinet
  };
  try {
    localStorage.setItem("lastSurvivorSave", JSON.stringify(saveData));
    notice.textContent = "Game saved.";
    notice.hidden = false;
  } catch (error) {
    notice.textContent = "The game could not be saved in this browser.";
    notice.hidden = false;
  }
}

function loadGame() {
  try {
    var savedText = localStorage.getItem("lastSurvivorSave");
    if (!savedText) throw new Error("No saved game found.");
    var savedGame = JSON.parse(savedText);
    if (!savedGame.player || typeof savedGame.player.health !== "number" || typeof savedGame.player.score !== "number" || !Array.isArray(savedGame.player.inventory) || !Array.isArray(savedGame.journal) || typeof savedGame.scene !== "string") {
      throw new Error("The saved game is incomplete.");
    }
    health = savedGame.player.health;
    score = savedGame.player.score;
    inventory = savedGame.player.inventory;
    journal = [];
    var i;
    for (i = 0; i < savedGame.journal.length; i = i + 1) {
      journal.push(new JournalEntry(savedGame.journal[i]));
    }
    helpedSurvivor = savedGame.helpedSurvivor;
    hasHavenInformation = savedGame.hasHavenInformation;
    hasSupplies = savedGame.hasSupplies;
    hasMap = savedGame.hasMap;
    heardRoadblockWarning = savedGame.heardRoadblockWarning;
    openedCabinet = savedGame.openedCabinet;
    updateDashboard();
    updateJournal();
    showScene(savedGame.scene);
    notice.textContent = "Saved game loaded.";
    notice.hidden = false;
  } catch (error) {
    notice.textContent = "No usable saved game was found.";
    notice.hidden = false;
  }
}

function loadSoundPreference() {
  var savedCookie = document.cookie.split(";");
  var i;
  for (i = 0; i < savedCookie.length; i = i + 1) {
    if (savedCookie[i].trim() === "soundEnabled=true") savedSoundPreference = true;
  }
  try {
    if (localStorage.getItem("soundEnabled") === "true") savedSoundPreference = true;
  } catch (error) {
    // The cookie remains available if this browser blocks local storage.
  }
  if (savedSoundPreference) {
    soundEnabled = true;
    soundButton.textContent = "Turn ambience off";
    playAmbience();
  } else {
    soundButton.textContent = "Turn ambience on";
  }
}

function playAmbience() {
  ambienceAudio.play().then(function () {
    soundIsPlaying = true;
    soundButton.textContent = "Turn ambience off";
    soundNotice.hidden = true;
  }).catch(function () {
    soundIsPlaying = false;
    soundButton.textContent = "Resume ambience";
    soundNotice.textContent = "Your sound setting is on. Click Resume ambience if the browser blocked autoplay.";
    soundNotice.hidden = false;
  });
}

function setSoundPreference() {
  soundEnabled = !soundIsPlaying;
  document.cookie = "soundEnabled=" + soundEnabled + "; max-age=31536000; path=/; SameSite=Lax";
  try {
    localStorage.setItem("soundEnabled", soundEnabled);
  } catch (error) {
    // The cookie still stores the preference if local storage is unavailable.
  }
  if (soundEnabled) {
    soundButton.textContent = "Turn ambience off";
    playAmbience();
  } else {
    ambienceAudio.pause();
    soundIsPlaying = false;
    soundButton.textContent = "Turn ambience on";
    soundNotice.hidden = true;
  }
}

codeForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!/^\d{3}$/.test(codeInput.value)) {
    codeMessage.textContent = "Enter exactly three digits.";
  } else if (codeInput.value === "472") {
    var oldHealth = health;
    var oldInventory = inventory.slice();
    openedCabinet = true;
    hasHavenInformation = true;
    inventory.push("Haven intake ledger");
    score = score + 1;
    codeMessage.textContent = "The cabinet opens. Inside is a ledger of Haven arrivals.";
    codeInput.disabled = true;
    codeForm.querySelector("button").disabled = true;
    updateNotice(oldHealth, oldInventory);
    updateDashboard();
    addJournalEntry("Found the Haven intake ledger in the hospital cabinet.");
  } else {
    codeMessage.textContent = "That code does not work.";
  }
});

sceneImage.addEventListener("mouseover", function () {
  imageTip.hidden = false;
});

sceneImage.addEventListener("mouseout", function () {
  imageTip.hidden = true;
});

document.addEventListener("keydown", function (event) {
  if (event.target.tagName === "INPUT") return;
  var choices = choiceList.getElementsByTagName("button");
  if (choices.length === 0) return;
  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    event.preventDefault();
    selectedChoice = selectedChoice + 1;
    if (selectedChoice >= choices.length) selectedChoice = 0;
    choices[selectedChoice].focus();
  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    selectedChoice = selectedChoice - 1;
    if (selectedChoice < 0) selectedChoice = choices.length - 1;
    choices[selectedChoice].focus();
  }
});

soundButton.addEventListener("click", setSoundPreference);
saveButton.addEventListener("click", saveGame);
loadButton.addEventListener("click", loadGame);
loadSoundPreference();

function restartGame() {
  clearInterval(countdownTimer);
  clearTimeout(storyDelay);
  health = 100;
  score = 0;
  inventory = ["Food", "Water", "Flashlight", "First-aid kit"];
  journal = [];
  helpedSurvivor = false;
  hasHavenInformation = false;
  hasSupplies = true;
  hasMap = false;
  heardRoadblockWarning = false;
  openedCabinet = false;
  codeInput.value = "";
  codeInput.disabled = false;
  codeForm.querySelector("button").disabled = false;
  updateDashboard();
  updateJournal();
  showScene("start");
}

restartButton.addEventListener("click", restartGame);

restartGame();
