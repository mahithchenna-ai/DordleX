const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const ALPHABETS = "QWERTYUIOPASDFGHJKLZXCVBNM";

let targetWords = [];
let currentGuess = "";
let currentRow = 0;
let roundsPlayed = 0;
let gameOver = false;
let isChecking = false;

const board1 = document.getElementById("board1");
const board2 = document.getElementById("board2");
const keyboard = document.getElementById("keyboard");
const loading = document.getElementById("loading");
const game = document.getElementById("game");
const roundsText = document.getElementById("rounds");
const resultModal = document.getElementById("result-modal");
const resultText = document.getElementById("result-text");
const resetBtn = document.getElementById("reset-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const meaningsDiv = document.getElementById("meanings");

// Tabs & Dictionary Elements
const tabGame = document.getElementById("tab-game");
const tabDict = document.getElementById("tab-dict");
const gameSection = document.getElementById("game-section");
const dictSection = document.getElementById("dict-section");
const dictInput = document.getElementById("dict-input");
const dictBtn = document.getElementById("dict-btn");
const dictResult = document.getElementById("dict-result");
const toast = document.getElementById("toast");

// ===============================
// FETCH 2 RANDOM WORDS
// ===============================
async function fetchWords() {
  try {
    const response = await fetch("https://api.datamuse.com/words?sp=?????&max=1000");
    const data = await response.json();

    // Pick 2 random words from the returned list
    const word1 = data[Math.floor(Math.random() * data.length)].word;
    const word2 = data[Math.floor(Math.random() * data.length)].word;

    return [word1.toUpperCase(), word2.toUpperCase()];
  } catch (err) {
    console.error("Failed to fetch words:", err);
    // Reliable fallback so the game never gets stuck loading forever
    return ["SMART", "BRAIN"];
  }
}

async function checkValidWord(word) {
  try {
    const response = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word.toLowerCase());
    return response.ok;
  } catch {
    return false;
  }
}

async function fetchMeaning(word) {
  try {
    const response = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + word.toLowerCase()
    );
    const data = await response.json();

    return (
      data[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
      "Meaning not found"
    );
  } catch {
    return "Meaning not found";
  }
}


// ===============================
// CREATE BOARD
// ===============================
function createBoard(board) {
  board.innerHTML = "";

  for (let row = 0; row < MAX_ATTEMPTS; row++) {
    for (let col = 0; col < WORD_LENGTH; col++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.id = `${board.id}-${row}-${col}`;
      board.appendChild(tile);
    }
  }
}


// ===============================
// CREATE KEYBOARD
// ===============================
function createKeyboard() {
  keyboard.innerHTML = "";

  ALPHABETS.split("").forEach((letter) => {
    const key = document.createElement("button");
    key.textContent = letter;
    key.classList.add("key");
    key.addEventListener("click", () => handleInput(letter));
    keyboard.appendChild(key);
  });

  const enterBtn = document.createElement("button");
  enterBtn.textContent = "ENTER";
  enterBtn.classList.add("key", "wide");
  enterBtn.addEventListener("click", submitGuess);

  const backBtn = document.createElement("button");
  backBtn.textContent = "⌫";
  backBtn.classList.add("key", "wide");
  backBtn.addEventListener("click", deleteLetter);

  keyboard.appendChild(enterBtn);
  keyboard.appendChild(backBtn);
}


// ===============================
// HANDLE INPUT
// ===============================
function handleInput(letter) {
  if (gameOver || currentGuess.length >= WORD_LENGTH) return;

  currentGuess += letter;
  updateBoards();
}

function deleteLetter() {
  if (gameOver) return;
  currentGuess = currentGuess.slice(0, -1);
  updateBoards();
}


// ===============================
// UPDATE BOTH BOARDS
// ===============================
function updateBoards() {
  [board1, board2].forEach((board) => {
    for (let col = 0; col < WORD_LENGTH; col++) {
      const tile = document.getElementById(`${board.id}-${currentRow}-${col}`);
      tile.textContent = currentGuess[col] || "";
    }
  });
}


// ===============================
// COLOR TILES
// ===============================
function colorBoard(board, target) {
  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = document.getElementById(`${board.id}-${currentRow}-${i}`);
    const letter = currentGuess[i];

    if (letter === target[i]) {
      tile.classList.add("correct");
    } else if (target.includes(letter)) {
      tile.classList.add("present");
    } else {
      tile.classList.add("absent");
    }
  }
}


function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

// ===============================
// SUBMIT GUESS
// ===============================
async function submitGuess() {
  if (gameOver || currentGuess.length !== WORD_LENGTH || isChecking) return;

  isChecking = true;
  const isValid = await checkValidWord(currentGuess);
  isChecking = false;

  if (!isValid) {
    showToast("Not a valid word!");
    return;
  }

  colorBoard(board1, targetWords[0]);
  colorBoard(board2, targetWords[1]);

  const win1 = currentGuess === targetWords[0];
  const win2 = currentGuess === targetWords[1];

  if (win1 && win2) {
    endGame("🎉 You solved both words!");
    return;
  }

  currentRow++;
  roundsPlayed++;
  roundsText.textContent = `Rounds Played: ${roundsPlayed}`;

  if (currentRow >= MAX_ATTEMPTS) {
    endGame(`❌ Game Over! Words: ${targetWords[0]}, ${targetWords[1]}`);
    return;
  }

  currentGuess = "";
}


// ===============================
// END GAME
// ===============================
function endGame(message) {
  gameOver = true;
  resultText.textContent = message;
  resultModal.classList.remove("hidden");

  showMeanings();
}

async function showMeanings() {
  meaningsDiv.innerHTML = "";

  for (let word of targetWords) {
    const meaning = await fetchMeaning(word);

    meaningsDiv.innerHTML += `
      <div class="meaning-card">
        <h3>${word}</h3>
        <p>${meaning}</p>
      </div>
    `;
  }
}

// ===============================
// RESET GAME
// ===============================
async function startGame() {
  loading.style.display = "block";
  game.classList.add("hidden");
  resultModal.classList.add("hidden");
  meaningsDiv.innerHTML = "";

  currentGuess = "";
  currentRow = 0;
  gameOver = false;
  roundsPlayed = 0;
  roundsText.textContent = "Rounds Played: 0";

  targetWords = await fetchWords();

  createBoard(board1);
  createBoard(board2);
  createKeyboard();

  loading.style.display = "none";
  game.classList.remove("hidden");
}


// ===============================
// EVENTS
// ===============================
document.addEventListener("keydown", (e) => {
  if (gameSection.classList.contains("hidden")) return;
  if (e.key === "Enter") submitGuess();
  else if (e.key === "Backspace") deleteLetter();
  else if (/^[a-zA-Z]$/.test(e.key)) handleInput(e.key.toUpperCase());
});

resetBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);

// Tabs Logic
tabGame.addEventListener("click", () => {
  tabGame.classList.add("active");
  tabDict.classList.remove("active");
  gameSection.classList.remove("hidden");
  dictSection.classList.add("hidden");
});

tabDict.addEventListener("click", () => {
  tabDict.classList.add("active");
  tabGame.classList.remove("active");
  dictSection.classList.remove("hidden");
  gameSection.classList.add("hidden");
});

// Dictionary Search
dictBtn.addEventListener("click", async () => {
  const word = dictInput.value.trim();
  if (!word) return;
  
  dictResult.innerHTML = "<p>Searching...</p>";
  const meaning = await fetchMeaning(word);
  
  dictResult.innerHTML = `
    <div class="meaning-card">
      <h3>${word.toUpperCase()}</h3>
      <p>${meaning}</p>
    </div>
  `;
});

dictInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") dictBtn.click();
});


// ===============================
// START
// ===============================
startGame();