const listes = document.querySelectorAll(".list");
const form = document.querySelector("#form");
let listCards = document.querySelectorAll(".list__card");
const addNoteBtn = document.querySelector("#addNoteBtn");

let notes = {
  todo: [],
  inProgress: [],
  done: [],
  remove: [],
};
let storageIndex = 0;
let bufArray = [];

// Функция push in array
const pushArray = (id, title, description) => {
  notes[id].push({ title: title, description: description });
};

const drawList = (id, list) => {
  list.innerHTML = "";

  notes[id].forEach((elem) => {
    list.innerHTML += `<div class="list__card" draggable="true"><div class="list-border"><div class="list__card_notes">
        <div class="note">
          <p>Title: <span class="note-name">${elem.title}</span></p>
        </div>
        <div class="note">
          <p>
            Description:
            <span class="note-description">${elem.description}</span>
          </p>
        </div>
      </div>
      <div class="block-buttons">
        <div class="button-note button-edit"></div>
        <div class="button-note button-next"></div>
        <div class="button-note button-remove"></div>
      </div></div></div>`;
  });
};

const addEventDrag = () => {
  listCards = document.querySelectorAll(".list__card");
  for (const card of listCards) {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
  }
  for (const list of listes) {
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop", dragDrop);
  }
};

addNoteBtn.addEventListener("click" || "keyup", (event) => {
  event.preventDefault();
  if (event.code === "Enter" || event.type === "click") {
    event.preventDefault();
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const list = event.target.closest(".list");
    const listWrap = list.querySelector(".wrapper");
    const listId = listWrap.getAttribute("id");
    pushArray(listId, title, description);

    drawList(listId, listWrap);

    addEventDrag();

    form.reset();
  }
});

const dragArray = (event) => {
  const list = event.target.closest(".wrapper"); // откуда взяли (list)
  const listCard = event.target.closest(".list__card");
  const listId = list.getAttribute("id"); // какой массив
  debugger;
  const title = listCard.querySelector(".note-name").textContent;
  const description = listCard.querySelector(".note-description").textContent;

  storageIndex = notes[listId].findIndex(
    (elem) => elem.title === title && elem.description === description
  );

  bufArray = notes[listId].slice(storageIndex, storageIndex + 1);
  notes[listId].splice(storageIndex, 1);
};

function dragStart(event) {
  const list = event.target.closest(".wrapper"); // откуда взяли (list)
  const listCard = event.target.closest(".list__card");
  const listId = list.getAttribute("id"); // какой массив
  const title = listCard.querySelector(".note-name").textContent;
  const description = listCard.querySelector(".note-description").textContent;

  storageIndex = notes[listId].findIndex(
    (elem) => elem.title === title && elem.description === description
  );

  bufArray = notes[listId].slice(storageIndex, storageIndex + 1);
  notes[listId].splice(storageIndex, 1);

  console.log(this);
  console.log(this.className);
  this.className += " hold";
  setTimeout(() => (this.className = "invisible"), 0);
  listCard.setAttribute("data-drag", "drag");
}

function dragEnd() {
  this.className = "list__card";
}

// Drop
function dragOver(event) {
  event.preventDefault();
}

function dragEnter(event) {
  event.preventDefault();

  this.className += " hovered"; // dashed
}

function dragLeave() {
  this.className = "list";
}

function dragDrop(event) {
  for (const card of listCards) {
    if (card.hasAttribute("data-drag")) {
      card.removeAttribute("data-drag");
      this.className = "list";

      card.setAttribute("class", "list__card");

      const target = event.currentTarget; // откуда взяли (list)
      const list = target.querySelector(".wrapper"); // откуда взяли (list)
      const listId = list.getAttribute("id"); // какой массив
      list.append(card);
      pushArray(listId, bufArray[0].title, bufArray[0].description);
      console.log("bufArray", bufArray, "Array", notes);
      bufArray = [];
      break;
    }
  }
}
