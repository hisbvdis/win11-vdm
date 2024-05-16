
const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");

document.addEventListener("DOMContentLoaded", async () => {
  const storeShortcuts = (await api.readFromStore()).shortcuts;
  Array.from(inputs).forEach((input) => {
    const actionType = input.dataset.type;
    const index = input.dataset.index;
    const shortcut = storeShortcuts[input.dataset.type][input.dataset.index];
    if (shortcut) {
      input.value = shortcut;
      api.addShortcut({actionType, index, shortcut});
    }
  })
})

form.addEventListener("keydown", (e:KeyboardEvent) => {
  e.preventDefault();
  const target = e.target as HTMLInputElement;
  const index = target.dataset.index;
  const actionType = target.dataset.type;
  const shortcut = ""
    .concat(e.ctrlKey ? "Ctrl+" : "")
    .concat(e.shiftKey ? "Shift+" : "")
    .concat(e.altKey ? "Alt+" : "")
    .concat(e.metaKey ? "Meta+" : "")
    .concat(
      e.code && e.code.startsWith("Digit") ? e.code.slice(5) :
      e.code && e.code.startsWith("Key") ? e.code.slice(3) :
      e.code && ["ControlLeft", "ControlRight", "AltLeft", "AltRight", "ShiftLeft", "ShiftRight", "MetaLeft", "MetaRight"].includes(e.code) ? "" :
      e.code
    )
  if (shortcut.endsWith("+")) return;
  target.value = shortcut;
  api.addShortcut({actionType, index, shortcut})
})

form.addEventListener("click", (e:MouseEvent) => {
  const target = e.target as HTMLButtonElement;
  if (!target.matches("[data-js='form__clearBtn']")) return;
  const index = target.dataset.index;
  const parentParagraph = target.closest("[data-js='form__field']") as HTMLParagraphElement;
  const input = parentParagraph.querySelector(".form__input") as HTMLInputElement;
  const actionType = target.dataset.type;
  api.cleanShortcut({actionType, index, shortcut:input.value})
  input.value = "";
})