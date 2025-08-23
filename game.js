

//- We generate intervals of numbers by random e.g. 1-20
//- User is asked to guess the correct number. An attempts of 5 is given
//- If the user guesses incorrectly, they are given a hint whether the number is higher or lower
//- If the user exhausts all attempts, they are shown the correct number
//- User can restart the game at any time

// File: script.js
// This script implements a simple number guessing game where the user has to guess a random number between
// Initialize
// Game variables
let randomNumber;
let attempts = 0;
const maxAttempts = 3;
let highScore = localStorage.getItem('numberGameHighScore') || 0;

// DOM elements
const guessBtn = document.getElementById("btn");
const updateAttemptsDisplay = document.getElementById("attempts");
const guessInput = document.getElementById("guessNumber");
const restartButton = document.getElementById("restart-btn");
const quitButton = document.getElementById("quit-btn");
const heroContainer = document.getElementById("hero-container");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const highScoreDisplay = document.getElementById("high-score");

// Audio elements
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const gameOverSound = document.getElementById("game-over-sound");
const buttonClickSound = document.getElementById("button-click-sound");
const soundToggle = document.getElementById("sound-toggle");
const themeSelector = document.getElementById("theme-selector");

// Play sound function
function playSound(soundElement) {
  if (soundElement && soundToggle.checked) {
    soundElement.currentTime = 0; // Reset to start
    soundElement.play().catch(error => {
      console.log("Sound play failed:", error);
    });
  }
}

// Visual effects functions
function addShakeEffect(element) {
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
  }, 500);
}

function addGlowEffect(element) {
  element.classList.add('glow');
  setTimeout(() => {
    element.classList.remove('glow');
  }, 1000);
}

function addBounceEffect(element) {
  element.classList.add('bounce');
  setTimeout(() => {
    element.classList.remove('bounce');
  }, 500);
}

function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDelay = Math.random() * 3 + 's';
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

// Theme management
function changeTheme(theme) {
  const body = document.body;
  const heroContainer = document.getElementById("hero-container");
  
  // Remove existing theme classes
  body.classList.remove('theme-default', 'theme-dark', 'theme-neon', 'theme-sunset');
  heroContainer.classList.remove('theme-default', 'theme-dark', 'theme-neon', 'theme-sunset');
  
  // Add new theme class
  body.classList.add(`theme-${theme}`);
  heroContainer.classList.add(`theme-${theme}`);
  
  // Save theme preference
  localStorage.setItem('numberGameTheme', theme);
}

// Update high score
function updateHighScore() {
  const currentScore = maxAttempts - attempts;
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem('numberGameHighScore', highScore);
    highScoreDisplay.textContent = highScore;
    displayMessage("🎉 NEW HIGH SCORE! 🎉");
  }
}

// Start the game
function startGame() {
  randomNumber = Math.floor(Math.random() * 30) + 1;
  attempts = 0;
  updateAttemptsDisplay.textContent = maxAttempts;
  highScoreDisplay.textContent = highScore;
  restartButton.textContent = "restart"
  
  // Clear ALL existing messages
  const existingMessages = document.querySelectorAll("#messageDisplay");
  existingMessages.forEach(message => {
    message.remove();
  });
  
  guessBtn.disabled = false;
  console.log("Random number generated:", randomNumber);
}

// Display message
function showMessage(message) {
  const messageElement = document.createElement("p");
  messageElement.id = "messageDisplay";
  messageElement.textContent = message;
  heroContainer.appendChild(messageElement);
  console.log("Display message:", message);
}

// Update attempts and check if game should end
function handleGuess() {
  const input = guessInput.value.trim();
  if (input === "" || isNaN(input)) {
    showMessage("Please enter a valid number.");
    return;
  }

  const guessedNumber = parseInt(input);
  const feedbackMessage = compareGuess(guessedNumber);

  showMessage(feedbackMessage);
  attempts++;
  const attemptsLeft = maxAttempts - attempts;
  updateAttemptsDisplay.textContent = attemptsLeft;

  // Play appropriate sound based on result
  if (feedbackMessage.includes("Congratulations")) {
    guessInput.value = "";
    restartButton.textContent = "Play Again";
    playSound(correctSound);
    updateHighScore();
    addGlowEffect(heroContainer);
    createConfetti();
    endGame();
  }
   else if (attempts >= maxAttempts) {
    playSound(gameOverSound);
    addShakeEffect(heroContainer);
    showMessage(`Sorry, the correct number was ${randomNumber}.`);
    restartButton.textContent = "Play Again";
    endGame();
  }
   else {
    playSound(wrongSound);
    addShakeEffect(guessInput);
  }
}

// Guess comparison
function compareGuess(guess) {
  if (guess > randomNumber) {
    return "You guessed too high. Try again.";
  } else if (guess < randomNumber) {
    return "You guessed too low. Try again.";
  } else {
    return "Congratulations! You've guessed the correct number.";
  }
}

// End the game
function endGame() {
  guessBtn.disabled = true;
}

// Event listeners
guessBtn.addEventListener("click", (e) => {
  e.preventDefault();
  playSound(buttonClickSound);
  addBounceEffect(guessBtn);
  handleGuess();
});

restartButton.addEventListener("click", () => {
  playSound(buttonClickSound);
  addBounceEffect(restartButton);
  startGame();
  guessInput.value = "";
});

quitButton.addEventListener("click", () => {
  playSound(buttonClickSound);
  addBounceEffect(quitButton);
  showMessage("Game ended. Thanks for playing!");
  guessBtn.disabled = true;
});

// Start button event listener
startBtn.addEventListener("click", () => {
  playSound(buttonClickSound);
  addBounceEffect(startBtn);
  startScreen.style.display = "none";
  heroContainer.style.display = "flex";
  startGame();
});

// Theme selector event listener
themeSelector.addEventListener("change", (e) => {
  changeTheme(e.target.value);
});

// Initialize theme
const savedTheme = localStorage.getItem('numberGameTheme') || 'default';
themeSelector.value = savedTheme;
changeTheme(savedTheme);

// Initialize (don't start game automatically)
// startGame(); // Removed this line




