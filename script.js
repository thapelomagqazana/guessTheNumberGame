"use script";

// Select elements
const message = document.querySelector(".message");
const guess = document.querySelector(".guess-input");
const scoreElement = document.querySelector(".score");
const numberDisplay = document.querySelector(".number-display");
const highScore = document.querySelector(".highscore");
const instruction = document.querySelector(".instruction");
const checkButton = document.querySelector(".check-button");
const againButton = document.querySelector(".again-button");
const modal = document.getElementById("start-game-modal");
const startButton = document.querySelector(".start-button");
const difficultyDropdown = document.querySelector(".difficulty-dropdown");
const timerElement = document.querySelector(".timer");

const maxChances = { easy: 10, medium: 7, hard: 5 };
const ranges = { easy: 10, medium: 20, hard: 50 };

let timer;
let timeRemaining;
let timerInterval;

let secretNumber;
let score;
let selectedDifficulty = "medium"; // Default difficulty

// Function to initialize game state
const initGame = () => {
  setDifficultySettings(selectedDifficulty);
  secretNumber = generateSecretNumber(ranges[selectedDifficulty]);
  score = maxChances[selectedDifficulty];
  scoreElement.textContent = score;
  numberDisplay.textContent = "?";
  displayMessage("Start guessing...");
  instruction.textContent = `Pick a number between 1 and ${ranges[selectedDifficulty]}`;
  guess.value = "";
  highScore.textContent = localStorage.getItem("HighScore") || 0;

  timeRemaining = getTimerDuration(selectedDifficulty);
  startTimer(); // Start the timer

  timerElement.textContent = `Time: ${timeRemaining}s`; // Reset timer display
  timerElement.style.color = "green"; // Reset timer color to green
};

// Function to set difficulty settings
const setDifficultySettings = (difficulty) => (selectedDifficulty = difficulty);

// Function to shake the number display for wrong guess
const shakeElement = (element) => {
  element.classList.add("shake");
  setTimeout(() => element.classList.remove("shake"), 500);
};

// Function to bounce the number display for correct guess
const bounceElement = (element) => {
  element.classList.add("bounce");
  setTimeout(() => element.classList.remove("bounce"), 500);
};

// Generate a random number based on range
const generateSecretNumber = (range) => Math.trunc(Math.random() * range) + 1;

// Function to display the modal when the game starts
const showModal = () => (modal.style.display = "flex"); // Show modal

// // Function to trigger confetti effect
// const triggerConfetti = () => {
//   confetti({
//     particleCount: 100, // Number of confetti pieces
//     spread: 70, // Spread angle for confetti
//     origin: { y: 0.6 }, // Starting point (bottom of the screen)
//     colors: ["#ff6347", "#ff8c00", "#32cd32", "#00bfff", "#ff69b4"], // Confetti colors
//   });
// };

// Disable Game Controls
const disableGameControls = () => {
  guess.disabled = true; // Disable input field
  checkButton.disabled = true; // Disable check button
};

// Reset Game on Difficulty Change or Restart
const resetGame = () => {
  guess.disabled = false; // Enable input field
  checkButton.disabled = false; // Enable check button
  initGame(selectedDifficulty);
};

const handleGameOver = () => {
  clearInterval(timerInterval); // Stop the timer
  displayMessage("😣 Time's Up! Game Over!");
  numberDisplay.textContent = secretNumber; // Reveal the secret number
  shakeElement(numberDisplay); // Visual feedback
  disableGameControls(); // Disable input and buttons
};

// Start Timer
const startTimer = () => {
  clearInterval(timerInterval); // Clear any existing timer
  timerInterval = setInterval(() => {
    timeRemaining--;

    updateTimerDisplay(timeRemaining);

    // Change timer color based on time remaining
    if (timeRemaining <= 15) {
      timerElement.style.color = "red";
    } else if (timeRemaining <= 30) {
      timerElement.style.color = "orange";
    } else {
      timerElement.style.color = "green";
    }

    // Timer reaches zero
    if (timeRemaining <= 0) {
      handleGameOver();
    }
  }, 1000);
};

// Get Timer Duration Based on Difficulty
const getTimerDuration = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return 60; // 60 seconds
    case "medium":
      return 45; // 45 seconds
    case "hard":
      return 30; // 30 seconds
  }
};

// Update Timer Display
const updateTimerDisplay = (time) => {
  document.querySelector(".timer").textContent = `Time: ${time}s`;
};

// Function to hide the modal and start the game
const hideModalAndStartGame = () => {
  modal.style.display = "none"; // Hide modal
  initGame(); // Initialize game after selecting difficulty
};

// Handle user input
const getUserInput = () => Number(guess.value);

// Display message
const displayMessage = (msg) => {
  message.textContent = msg;
};

const updateScore = () => {
  const currentScore = Number(scoreElement.textContent);
  scoreElement.textContent = currentScore - 1;
};

const updateHiScore = () => {
  const recentScore = Number(scoreElement.textContent);
  if (recentScore > Number(highScore.textContent)) {
    localStorage.setItem("HighScore", recentScore);
    highScore.textContent = recentScore;
  }
};

// Handle the guess with the secret number
const handleGuess = (userGuess) => {
  if (Number(scoreElement.textContent) > 1) {
    if (userGuess === secretNumber) {
      displayMessage("🎉Correct Number!");
      numberDisplay.textContent = secretNumber;
      clearInterval(timerInterval); // Stop timer on win
      // triggerConfetti(); // Trigger confetti effect
      updateHiScore();
      bounceElement(numberDisplay); // Bounce effect for correct guess
    } else {
      displayMessage(userGuess > secretNumber ? "📈Too High!" : "📉Too Low!");
      updateScore();
      shakeElement(numberDisplay); // Shake effect for wrong input
    }
  } else {
    displayMessage("😣Game Over!");
    scoreElement.textContent = 0;
    clearInterval(timerInterval);
    numberDisplay.textContent = secretNumber; // Reveal the secret number
    shakeElement(numberDisplay); // Visual feedback
    disableGameControls(); // Disable input and buttons
  }
};

// Event listener for "Start Game" button in modal
startButton.addEventListener("click", function () {
  // Get selected difficulty from dropdown
  const selectedOption =
    difficultyDropdown.options[difficultyDropdown.selectedIndex].value;
  setDifficultySettings(selectedOption);
  hideModalAndStartGame(); // Hide modal and start game
});

// Event listener for 'Check' button
checkButton.addEventListener("click", function () {
  const userGuess = getUserInput();
  if (!userGuess) {
    displayMessage(`⛔ No number`);
    shakeElement(numberDisplay); // Shake effect for wrong input
  } else if (userGuess < 1 || userGuess > ranges[selectedDifficulty]) {
    displayMessage(
      `⛔ Invalid Number! Pick a number between 1 and ${ranges[selectedDifficulty]}`
    );
    shakeElement(numberDisplay); // Shake effect for wrong input
  } else {
    handleGuess(userGuess);
  }
  guess.value = "";
});

// Event listener for 'Play Again' button
againButton.addEventListener("click", resetGame); // Reset the game state

// Show the modal when the page loads
showModal();
