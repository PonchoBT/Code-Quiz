//Source of questions for the quiz
var questionSource = [
  {
    // Question about HTML
    question: "Question HTML 1: What does HTML stand for?",
    answer_btn: [
      "a. Hyperlinks and Text Markup Language",
      "b. Hyper Text Markup Language",
      "c. Hyperlinking Text Marking Language",
      "d. Hyper Text Markdown Language",
    ],
    answer: "b", // correct
  },
  {
    question:
      "Question CSS 1: Which property is used to change the background color of an element?",
    answer_btn: [
      "a. bgcolor",
      "b. color",
      "c. background-color",
      "d. background-image",
    ],
    answer: "c",
  },
  {
    question:
      'Questions JavaScript 3 : What will the following code output to the console? console.log(typeof "Hello, world!");',
    answer_btn: ["a. string", "b. text", "c. object", "d. undefined"],
    answer: "a",
  },
  {
    question:
      "Questions HTML + CSS 4 : Which option is the correct way to add a background color to all <p> elements using an external CSS file?",
    answer_btn: [
      "a. p {background-color: #FFFFFF;}",
      "b. <p style='background-color: #FFFFFF;'>",
      "c. <p bgcolor='#FFFFFF'>",
      "d. p.backgroundColor = '#FFFFFF';",
    ],
    answer: "a",
  },
  {
    question:
      "Questions JavaScript 5 : What is the correct syntax for referring to an external script called 'app.js'?",
    answer_btn: [
      "a. <script src='app.js'>",
      "b. <script href='app.js'>",
      "c. <script link='app.js'>",
      "d. <script name='app.js'>",
    ],
    answer: "a",
  },
];

// Assignment Code to each section
var startBtn = document.querySelector("#start_btn");
var introPage = document.querySelector("#intro_page");

var questionPage = document.querySelector("#question_page");
var askQuestion = document.querySelector("#ask_question");

var answerBtns = document.querySelectorAll(".answer_btn");
var answerBtn1 = document.querySelector("#answer_btn1");
var answerBtn2 = document.querySelector("#answer_btn2");
var answerBtn3 = document.querySelector("#answer_btn3");
var answerBtn4 = document.querySelector("#answer_btn4");

var correctOrWrong = document.querySelector("#correct_or_wrong");
var scoreBoard = document.querySelector("#submit_page");
var finalScore = document.querySelector("#final_score");
var userInitial = document.querySelector("#initial");

var submitBtn = document.querySelector("#submit_btn");
var highScorePage = document.querySelector("#highscore_page");
var scoreRecord = document.querySelector("#score_record");
var scoreCheck = document.querySelector("#score_check");
var finish = document.querySelector("#finish");

var backBtn = document.querySelector("#back_btn");
var clearBtn = document.querySelector("#clear_btn");

var timeLeft = document.getElementById("timer");

var secondsLeft = 75;
var questionNumber = 0;
var totalScore = 0;
var questionCount = 1;


// // List of selectors for the elements you want to hide
var selectors = [".question_page", ".submit_page", ".highscore_page", "#check_line"];

// Iterates over each selector and hides the corresponding elements
selectors.forEach(function(selector) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function(element) {
    element.style.display = 'none';
    });
});

// WHEN I click the start button, THEN a timer starts(The setInterval() Method)
function countdown() {
  var timerInterval = setInterval(function () {
    secondsLeft--;
    timeLeft.textContent = "Time: " + secondsLeft;

    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timeLeft.textContent = "Time is up!";
      // if time is up, show on score board content instead of "all done!"
      finish.textContent = "Time is up!";
      gameOver();
    } else if (questionCount >= questionSource.length + 1) {
      clearInterval(timerInterval);
      gameOver();
    }
  }, 1000);
}

// Click the button to start the quiz
function startQuiz() {
  introPage.style.display = "none";
  questionPage.style.display = "block";
  questionNumber = 0;
  countdown();
  showQuestion(questionNumber);
}
// Present the questions and answers
function showQuestion(n) {
  askQuestion.textContent = questionSource[n].question;
  answerBtn1.textContent = questionSource[n].answer_btn[0];
  answerBtn2.textContent = questionSource[n].answer_btn[1];
  answerBtn3.textContent = questionSource[n].answer_btn[2];
  answerBtn4.textContent = questionSource[n].answer_btn[3];
  questionNumber = n;
}

// WHEN I answer a question,Show if answer is correct or wrong
function checkAnswer(event) {
  event.preventDefault();
  // Make it display
  correctOrWrong.style.display = "block";
  setTimeout(function () {
    correctOrWrong.style.display = "none";
  }, 1000);

  // Answer check
  if (questionSource[questionNumber].answer == event.target.value) {
    correctOrWrong.textContent = "Correct!";
     // Style color green and font Size
    correctOrWrong.style.color = "green";
    correctOrWrong.style.fontSize = "40px";
    totalScore = totalScore;
  } else {
    secondsLeft = secondsLeft;
    correctOrWrong.textContent = "Wrong!";
     // Style color red and font Size
    correctOrWrong.style.color = "red";
    correctOrWrong.style.fontSize = "40px";
  }
  // THEN I am presented with another question
  if (questionNumber < questionSource.length - 1) {
    // call showQuestions to bring in next question when any reactBtn is clicked
    showQuestion(questionNumber + 1);
  } else {
    gameOver();
  }
  questionCount++;
}
// WHEN all questions are answered or the timer reaches 0, Game is over
function gameOver() {
  questionPage.style.display = "none";
  scoreBoard.style.display = "block";
  console.log(scoreBoard);
  // Show final score
  finalScore.textContent = "Your final score is :" + secondsLeft;
  // ClearInterval(timerInterval);
  timeLeft.style.display = "none";
}

// Get current score and initials from local storage
function getScore() {
  var currentList = localStorage.getItem("ScoreList");
  if (currentList !== null) {
    freshList = JSON.parse(currentList);
    return freshList;
  } else {
    freshList = [];
  }
  return freshList;
}

// Render score to the score board
function renderScore() {
    scoreRecord.innerHTML = "";
    scoreRecord.style.display = "block";
    var highScores = getScore(); 
    var topFive = highScores.slice(0, 5);
    for (var i = 0; i < topFive.length; i++) {
      var item = topFive[i];
      // Shows the score list on the board
      var li = document.createElement("li");
      li.textContent = item.user + " - " + item.score;
      li.setAttribute("data-index", i);
      scoreRecord.appendChild(li);
    }
  }
  
  function addItem(n) {
    var addedList = getScore() || []; 
    // Gets the current list or initializes a new one if null
    addedList.push(n);
    localStorage.setItem("ScoreList", JSON.stringify(addedList));
  }
  
  function saveScore() {
    var scoreItem = {
        // Assume this is a user-entered value
      user: userInitial.value,
      // Assume this is the time remaining or a specific score
      score: secondsLeft, 
    };
    addItem(scoreItem);
    renderScore();
  }
  
  function getScore() {
    // This function should retrieve the list of scores from local storage
    var scores = localStorage.getItem("ScoreList");
    return scores ? JSON.parse(scores) : [];
  }
  

// startbtn to start the quiz
startBtn.addEventListener("click", startQuiz);

//click any choices button, go to the next question
answerBtns.forEach(function (click) {
  click.addEventListener("click", checkAnswer);
});

//save information and go to next page
submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  scoreBoard.style.display = "none";
  introPage.style.display = "none";
  highScorePage.style.display = "block";
  questionPage.style.display = "none";
  saveScore();
});

// check highscore ranking list
scoreCheck.addEventListener("click", function (event) {
  event.preventDefault();
  scoreBoard.style.display = "none";
  introPage.style.display = "none";
  highScorePage.style.display = "block";
  questionPage.style.display = "none";
  renderScore();
});

//go back to main page
backBtn.addEventListener("click", function (event) {
  event.preventDefault();
  scoreBoard.style.display = "none";
  introPage.style.display = "block";
  highScorePage.style.display = "none";
  questionPage.style.display = "none";
  location.reload();
});

//clear local storage and clear page shows
clearBtn.addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.clear();
  renderScore();
});
