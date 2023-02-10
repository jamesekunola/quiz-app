const questionNumber = document.querySelector(".question-number");
const question = document.querySelector(".question");
const optionContainer = document.querySelector(".option__container");
const btn = document.querySelector("#btn");
const closeBtn = document.querySelector(".btn-close");
const score = document.querySelector(".score");
const failedQues = document.querySelector(".failed-ques");
const result = document.querySelector(".result .incorrect-option");
const correctResult = document.querySelector(".result .correct-option");
const overlay = document.querySelector(".overlay");
const quizResult = document.querySelector(".quiz-result");
const nextBtn = document.querySelector(".next-btn2");
let quizQuestionCurrentIndex = 0;
let position = 0;
let quizOptionsclickedValue = [];
let questionFailedAndcorrectAns = [];
const url = "https://opentdb.com/api.php?amount=20&category=27";

// event listener
window.addEventListener("DOMContentLoaded", () => {
  getQuestions();
});

// function

function getQuestions() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // set quiz question
      displayQuizQuestion(data.results);

      // add bg-color to the option clicked and store the value of the option clicked
      optionContainer.addEventListener("click", (e) => {
        const bgColorRemover = document.querySelector(".opt__btn.bg-color");
        if (bgColorRemover) {
          bgColorRemover.classList.remove("bg-color");
        }
        const specificOptionBtn = e.target.dataset.id;
        if (specificOptionBtn) {
          e.target.classList.add("bg-color");
          btn.classList.add("allowed");

          // store the value of the option clicked
          quizOptionsclickedValue[quizQuestionCurrentIndex] = {
            qus: data.results[quizQuestionCurrentIndex].question,
            ans: e.target.innerHTML,
          };
        }
      });

      //  check is the option selected is correct else store the question failed and the correct_answer
      btn.addEventListener("click", () => {
        // check if no option was selected
        const clickedValue = quizOptionsclickedValue[quizQuestionCurrentIndex];
        if (clickedValue != undefined) {
          // check if the answer selected matches the correct answer
          if (
            clickedValue.ans !==
            data.results[quizQuestionCurrentIndex].correct_answer
          ) {
            questionFailedAndcorrectAns.push({
              qus: clickedValue.qus,
              ans: data.results[quizQuestionCurrentIndex].correct_answer,
              choice: quizOptionsclickedValue[quizQuestionCurrentIndex].ans,
            });
          }

          quizQuestionCurrentIndex++;

          if (quizQuestionCurrentIndex >= data.results.length) {
            quizResult.classList.add("show");
            overlay.classList.add("show");
            score.innerHTML = `Your score ${
              data.results.length - questionFailedAndcorrectAns.length
            }/${data.results.length}`;

            failedQues.innerHTML = questionFailedAndcorrectAns[position].qus;
            result.innerHTML = questionFailedAndcorrectAns[position].choice;
            correctResult.innerHTML = questionFailedAndcorrectAns[position].ans;

            return;
          }

          btn.classList.remove("allowed");
          displayQuizQuestion(data.results);
        }
      });
    })
    .catch((error) => console.log(error.message));
}

function displayQuizQuestion(q) {
  const quizQuestion = q[quizQuestionCurrentIndex].question;
  const wrongQuestionOption = q[quizQuestionCurrentIndex].incorrect_answers;
  const correctAnswer = q[quizQuestionCurrentIndex].correct_answer;

  // joining incorrect_answers with correct_answer
  const totalQuestionOption = [...wrongQuestionOption, correctAnswer];

  // randomize totolQuestionOption

  totalQuestionOption.sort(() => Math.random() - 0.5);

  // set question
  questionNumber.innerHTML = `Question ${quizQuestionCurrentIndex + 1}/${
    q.length
  }`;
  question.innerHTML = quizQuestion;

  // set quiz options
  const quizOptionSelect = totalQuestionOption
    .map((data, index) => {
      return `  <li class="opt__btn" data-id=${index}>${data}</li>`;
    })
    .join("");

  optionContainer.innerHTML = quizOptionSelect;
}

// close of quiz result pop up div and refresh the application
const closeQuizResultBox = () => {
  quizResult.classList.remove("show");
  overlay.classList.remove("show");
  window.location.reload(true);
};
closeBtn.addEventListener("click", closeQuizResultBox);

// get next failed question
const getnextFaiedQuestion = () => {
  position++;

  failedQues.innerHTML = questionFailedAndcorrectAns[position].qus;
  result.innerHTML = questionFailedAndcorrectAns[position].choice;
  correctResult.innerHTML = questionFailedAndcorrectAns[position].ans;

  if (position >= questionFailedAndcorrectAns.length - 1) {
    nextBtn.style.backgroundColor = " rgb(236, 231, 231)";
    nextBtn.style.cursor = "not-allowed";
    position = questionFailedAndcorrectAns.length - 1;
  }

  console.log(position, questionFailedAndcorrectAns);
};
nextBtn.addEventListener("click", getnextFaiedQuestion);

// change background color and get value of the option when clicked.
