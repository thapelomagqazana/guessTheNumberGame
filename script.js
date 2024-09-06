"use script";

// Select elements
const message = document.querySelector(".message");
const guess = document.querySelector(".guess-input");
const score = document.querySelector(".score");
const numberDisplay = document.querySelector(".number-display");
const highScore = document.querySelector(".highscore");
const checkButton = document.querySelector(".check-button");
const againButton = document.querySelector(".again-button");
const maxChances = 20;

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

// Generate a random number between 1 and 20
const generateSecretNumber = () => Math.trunc(Math.random() * 20) + 1;

// Handle user input
const getUserInput = () => Number(guess.value);

// Display message
const displayMessage = (msg) => {
  message.textContent = msg;
};

const updateScore = () => {
  const currentScore = Number(score.textContent);
  score.textContent = currentScore - 1;
};

const updateHiScore = () => {
  const recentScore = Number(score.textContent);
  if (recentScore > Number(highScore.textContent)) {
    localStorage.setItem("HighScore", recentScore);
    highScore.textContent = recentScore;
  }
};

// Compare the guess with the secret number
const compareGuess = (userGuess, secretNumber) => {
  if (Number(score.textContent) > 1) {
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
    score.textContent = 0;
  }
};

const randomNumber = generateSecretNumber();
highScore.textContent = localStorage.getItem("HighScore") || 0;

checkButton.addEventListener("click", function () {
  const userGuess = getUserInput();
  if (!userGuess || userGuess < 1 || userGuess > 20) {
    displayMessage(
      `❌Invalid Number! Pick a number between 1 and ${maxChances}`
    );
    shakeElement(numberDisplay); // Shake effect for wrong input
  } else {
    compareGuess(userGuess, randomNumber);
  }
  guess.value = "";
});

againButton.addEventListener("click", function () {
  score.textContent = maxChances;
  numberDisplay.textContent = "?";
  displayMessage("Start guessing...");
  guess.value = "";
});
