function round(num, decimalPlaces = 0) {
  num = Math.round(num + "e" + decimalPlaces);
  return Number(num + "e" + -decimalPlaces);
}
function clearState(state) {
  state.result = 0;
  state.value = "0";
  state.history = [];
  state.operation = "initial";
  state.expression = "";
};

const keyCodes = ["Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9", "Backspace", "KeyC", "NumpadDivide", "NumpadMultiply", "NumpadEnter", "NumpadSubtract", "NumpadAdd", "NumpadDecimal"];
const mapping = {
  "+": (acc, value) => acc + Number(value),
  "-": (acc, value) => acc - Number(value),
  "x": (acc, value) => acc * Number(value),
  "/": (acc, value) => acc / Number(value),
  "=": () => state.result,
  "": (acc, value) => acc + Number(value),
};

const inputRef = document.querySelector("#value");
const historyRef = document.querySelector("#history");

const state = {
  result: 0,
  value: "0",
  history: [],
  operation: "initial",
  expression: "",
};

document.querySelectorAll(".num").forEach((n) => {
  n.addEventListener("click", (e) => {
    const num = e.target.textContent;

    switch (state.operation) {
      case "initial":
        inputRef.style.fontSize = "34px";
        historyRef.textContent = state.history.join(" ");
      case "action":
        state.value = num;
        state.operation = "standby";

        inputRef.value = state.value;
        break;
      case "standby":
      default:
        if (state.value === "0") state.value = num
        else state.value += num;

        inputRef.value = state.value;
        break;
    }
  });
});
document.querySelectorAll(".expression").forEach((e) => {
  e.addEventListener("click", (e) => {
    const expression = e.target.textContent;

    if (state.expression === "/" && state.value == 0) {
      clearState(state);
      inputRef.style.fontSize = "20px";
      historyRef.textContent = state.history.join(" ");
      inputRef.value = "Cannot divide by zero";

      return;
    }
    if (state.operation === "action") {
      state.expression = expression;
      state.history[state.history.length - 1] = state.expression;
      historyRef.textContent = state.history.join(" ");
    
      return;
    }

    state.operation = "action";
    state.result = round(mapping[state.expression](state.result, state.value), 8);
    state.expression = expression;

    state.history.push(state.value, state.expression);
    historyRef.textContent = state.history.join(" ");

    if (state.history.length > 2) {
      state.value = state.result;
      inputRef.value = state.value;
    }
    if (expression === "=") {
      clearState(state);
    }
  })
});
document.querySelector("#KeyC").addEventListener("click", () => {
  clearState(state);

  historyRef.textContent = state.history.join(" ");
  inputRef.value = state.value;
});
document.querySelector("#Backspace").addEventListener("click", () => {
  if (state.value.length === 1) state.value = "0";
  else state.value = state.value.slice(0, -1);

  inputRef.value = state.value;
});
document.querySelector("#percentage").addEventListener("click", () => {
  if (state.history.length === 0) {
    state.value = "0";
    inputRef.value = state.value;
    return;
  }
  switch (state.operation) {
    case "initial":
      state.value = "0";
      inputRef.value = state.value;
      break;
    case "action":
      state.value = "1";
      inputRef.value = state.value;
      break;
    case "standby":
    default:
      state.value = String((Number(state.value) / 100));
      inputRef.value = state.value;
      break;
  }
});
document.querySelector("#NumpadDecimal").addEventListener("click", () => {
  if (state.value.includes(".")) return;

  state.value += ".";
  inputRef.value = state.value;
});

document.addEventListener("keydown", (e) => {
  if (keyCodes.includes(e.code)) document.querySelector(`#${e.code}`).click();
})