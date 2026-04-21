/**
 * javascript functions for page manipulation
 * 
 */ 

let clues = [];
let currentIndex = 0;

async function loadGame() {
  const res = await fetch("http://localhost:3000/game/9418");
  const data = await res.json();

  clues = data.clues;
  showClue();
}

function showClue() {
  const clue = clues[currentIndex];

  document.getElementById("clue").textContent = clue.question;
  document.getElementById("answer").textContent = clue.answer;
  document.getElementById("answer").style.display = "none";
}

function showAnswer() {
  document.getElementById("answer").style.display = "block";
}

function nextClue() {
  currentIndex++;

  if (currentIndex >= clues.length) {
    document.getElementById("clue").textContent = "Game over!";
    document.getElementById("answer").style.display = "none";
    return;
  }

  showClue();
}

loadGame();