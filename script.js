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

const maxChances = { easy: 10, medium: 7, hard: 5 };
const ranges = { easy: 10, medium: 20, hard: 50 };
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
againButton.addEventListener("click", initGame); // Reset the game state

// Show the modal when the page loads
showModal();
