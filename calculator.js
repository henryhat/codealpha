const display = document.getElementById("display");

function appendValue(value) {
  display.value += value;
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function deleteAll() {
    display.value = display.value.slice(0, 0)
}

function calculate() {
  try {
    display.value = eval(display.value);
  } catch {
    display.value = "Error";
  }
}

function calculate() {
  try {
    let expression = display.value.replace(/%/g, "/100");
    display.value = eval(expression);
  } catch {
    display.value = "Error";
  }
}



document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!isNaN(key)) {
    // Number keys (0-9)
    appendNumber(key);
  } else if (key === "+") {
    appendOperator("+");
  } else if (key === "-") {
    appendOperator("-");
  } else if (key === "*") {
    appendOperator("*");
  } else if (key === "/") {
    appendOperator("/");
  } else if (key === ".") {
    appendDecimal();
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearDisplay();
  }
});
