function setMessage(target, text, type) {
  if (!target) {
    return;
  }
  target.textContent = text;
  target.className = "create_message " + type;
}

function encodeQuestions(questions) {
  var json = JSON.stringify(questions);
  return btoa(unescape(encodeURIComponent(json)));
}

function addDays(days) {
  var now = Date.now();
  return now + days * 24 * 60 * 60 * 1000;
}

function buildShareUrl(questions) {
  var baseUrl = window.location.origin + "/";
  var encoded = encodeQuestions(questions);
  var expiresAt = addDays(2);
  return baseUrl + "?q=" + encodeURIComponent(encoded) + "&exp=" + expiresAt;
}

function stripPrefix(text) {
  return text.replace(/^[a-e]\.\s*/i, "");
}

function loadSavedQuestions() {
  var stored = null;
  try {
    stored = JSON.parse(localStorage.getItem("customQuestions"));
  } catch (error) {
    stored = null;
  }
  if (!Array.isArray(stored) || stored.length !== 5) {
    return;
  }
  var blocks = document.querySelectorAll(".question-builder");
  blocks.forEach(function (block, index) {
    var item = stored[index];
    if (!item) {
      return;
    }
    var questionInput = block.querySelector(".question-input");
    if (questionInput) {
      questionInput.value = item.question || "";
    }
    var answers = Array.isArray(item.answer_btn) ? item.answer_btn : [];
    var answerInputs = block.querySelectorAll(".answer-input");
    answerInputs.forEach(function (input, idx) {
      var value = answers[idx] || "";
      input.value = stripPrefix(value);
    });
    var correctSelect = block.querySelector(".correct-select");
    if (correctSelect) {
      correctSelect.value = item.answer || "";
    }
  });
}

function buildQuestions() {
  var blocks = document.querySelectorAll(".question-builder");
  var questions = [];
  var errors = [];
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    var questionNumber = i + 1;
    var questionInput = block.querySelector(".question-input");
    var questionText = questionInput ? questionInput.value.trim() : "";
    if (!questionText) {
      errors.push("Completa la pregunta " + questionNumber + ".");
    }
    var answers = [];
    var answerInputs = block.querySelectorAll(".answer-input");
    if (answerInputs.length !== 5) {
      errors.push("Faltan respuestas en la pregunta " + questionNumber + ".");
    }
    for (var j = 0; j < answerInputs.length; j++) {
      var input = answerInputs[j];
      var option = input.getAttribute("data-option");
      var value = input.value.trim();
      if (!value) {
        errors.push(
          "Completa la respuesta " +
            option.toUpperCase() +
            " de la pregunta " +
            questionNumber +
            "."
        );
      }
      answers.push(option + ". " + value);
    }
    var correctSelect = block.querySelector(".correct-select");
    var correctValue = correctSelect ? correctSelect.value : "";
    if (!correctValue) {
      errors.push(
        "Selecciona la respuesta correcta en la pregunta " + questionNumber + "."
      );
    }
    questions.push({
      question: questionText,
      answer_btn: answers,
      answer: correctValue,
    });
  }
  if (errors.length) {
    return { error: "Completa los campos marcados en rojo." };
  }
  return { questions: questions };
}

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("create_form");
  var message = document.getElementById("create_message");
  var resetBtn = document.getElementById("reset_questions");
  var successModal = document.getElementById("create_success_modal");
  var successModalBody = document.getElementById("create_success_modal_body");
  var shareBox = document.getElementById("share_box");
  var shareInput = document.getElementById("share_input");
  var copyShare = document.getElementById("copy_share");

  loadSavedQuestions();
  try {
    var savedQuestions = JSON.parse(localStorage.getItem("customQuestions"));
    if (Array.isArray(savedQuestions) && savedQuestions.length === 5) {
      if (shareInput) {
        shareInput.value = buildShareUrl(savedQuestions);
      }
    }
  } catch (error) {
    // Ignore invalid stored data
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var result = buildQuestions();
      if (result.error) {
        setMessage(message, result.error, "error");
        applyErrorStyles();
        return;
      }
      localStorage.setItem("customQuestions", JSON.stringify(result.questions));
      localStorage.setItem(
        "customQuestionsMeta",
        JSON.stringify({ expiresAt: addDays(2) })
      );
      setMessage(
        message,
        "Preguntas guardadas. Abre el quiz para usarlas.",
        "success"
      );
      if (shareBox && shareInput) {
        shareInput.value = buildShareUrl(result.questions);
      }
      if (successModal && window.bootstrap) {
        if (successModalBody) {
          successModalBody.textContent = "Preguntas guardadas. Abre el quiz para usarlas.";
        }
        var modal = window.bootstrap.Modal.getOrCreateInstance(successModal);
        modal.show();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      localStorage.removeItem("customQuestions");
      localStorage.removeItem("customQuestionsMeta");
      setMessage(
        message,
        "Listo. El quiz usará las preguntas originales.",
        "info"
      );
      if (shareBox && shareInput) {
        shareInput.value = "";
      }
      clearErrorStyles();
    });
  }

  if (copyShare && shareInput) {
    copyShare.addEventListener("click", function () {
      if (!shareInput.value) {
        return;
      }
      navigator.clipboard.writeText(shareInput.value).then(function () {
        setMessage(message, "Link copiado.", "success");
      });
    });
  }
});

function applyErrorStyles() {
  var blocks = document.querySelectorAll(".question-builder");
  blocks.forEach(function (block) {
    var questionInput = block.querySelector(".question-input");
    if (questionInput && !questionInput.value.trim()) {
      questionInput.classList.add("input-error");
    }
    var answerInputs = block.querySelectorAll(".answer-input");
    answerInputs.forEach(function (input) {
      if (!input.value.trim()) {
        input.classList.add("input-error");
      }
    });
    var correctSelect = block.querySelector(".correct-select");
    if (correctSelect && !correctSelect.value) {
      correctSelect.classList.add("input-error");
    }
  });
}

function clearErrorStyles() {
  var fields = document.querySelectorAll(".input-error");
  fields.forEach(function (field) {
    field.classList.remove("input-error");
  });
}

document.addEventListener("input", function (event) {
  if (event.target && event.target.classList.contains("input-error")) {
    if (event.target.value && event.target.value.trim()) {
      event.target.classList.remove("input-error");
    }
  }
});
