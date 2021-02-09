const tasker = document.querySelector(".flex");
const listes = document.querySelectorAll(".list");
const form = document.querySelector("#form");
let listCards = document.querySelectorAll(".list__card");
const addNoteBtn = document.querySelector("#addNoteBtn");

// Объект и 4 массива
let notes = {
  todo: [],
  inProgress: [],
  done: [],
  remove: [],
};
// Для drag and drop
let storageIndex = 0;
let bufArray = [];

// Для edit
const modal = document.querySelector(".modal");
const inputTitle = document.querySelector("#modal-title");
const inputDescription = document.querySelector("#modal-description");
let bufList = 0;
let listId = 0;

// Функция поиска индекса
const searchIndex = (id, title, description) => {
  storageIndex = notes[id].findIndex(
    (elem) => elem.title === title && elem.description === description
  );
};

// Функция вырезать из массива
const cutArrayValue = (listId) => {
  bufArray = notes[listId].slice(storageIndex, storageIndex + 1);
  notes[listId].splice(storageIndex, 1);
};

// Функция вставки карточки
const appendArrayCard = (card, list) => list.append(card);
// Функция push in array
const pushArray = (id, title, description) => {
  notes[id].push({ title: title, description: description });
};

// Функция отрисовки (draw)
const drawList = (id, list) => {
  list.innerHTML = "";

  if (id) {
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
  }
};

// Привязка drag and drop functions
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

// Событие по кнопке Добавить
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

// Функция редактирования. Работа с madal
const openModal = () => (modal.style.display = "block");

const closeModal = () => {
  modal.style.display = "none";
};

const editNote = (event) => {
  const listCard = event.target.closest(".list-border");
  const list = event.target.closest(".wrapper");
  const title = listCard.querySelector(".note-name").textContent;
  const description = listCard.querySelector(".note-description").textContent;
  listId = list.getAttribute("id"); // какой массив

  inputTitle.value = title;
  inputDescription.value = description;

  searchIndex(listId, title, description);

  bufList = list;
  openModal();
};

const spliceEditArray = (
  id = listId,
  title = inputTitle,
  description = inputDescription,
  index = storageIndex
) => {
  notes[id].splice(index, 1, {
    title: title.value,
    description: description.value,
  });
};

const editApply = (event) => {
  event.preventDefault();

  spliceEditArray();

  closeModal();

  drawList(listId, bufList);

  addEventDrag();
};

const updateList = (listId, title, description, listWrap) => {
  searchIndex(listId, title, description);

  cutArrayValue(listId);

  drawList(listId, listWrap);
};

const updateNewList = (id, wrap) => {
  pushArray(id, bufArray[0].title, bufArray[0].description);
  bufArray = [];

  drawList(id, wrap);
};

const moveNote = (event) => {
  event.preventDefault();

  const list = event.target.closest(".list");
  const listWrap = event.target.closest(".wrapper");
  const listCard = event.target.closest(".list__card");
  const title = listCard.querySelector(".note-name").textContent;

  const description = listCard.querySelector(".note-description").textContent;
  const listId = listWrap.getAttribute("id");

  if (!(listId === "remove")) {
    updateList(listId, title, description, listWrap);

    const listNext = list.nextElementSibling;
    const listNextWrap = listNext.querySelector(".wrapper");
    const listNextId = listNextWrap.getAttribute("id");

    updateNewList(listNextId, listNextWrap);
  }
  addEventDrag();
};

const removeNote = (event) => {
  event.preventDefault();

  const listWrap = event.target.closest(".wrapper");
  const listCard = event.target.closest(".list__card");
  const title = listCard.querySelector(".note-name").textContent;
  const description = listCard.querySelector(".note-description").textContent;
  const listId = listWrap.getAttribute("id");

  updateList(listId, title, description, listWrap);

  const listDel = tasker.lastElementChild;
  const listDelWrap = listDel.querySelector(".wrapper");
  const listDelId = "remove";

  updateNewList(listDelId, listDelWrap);

  addEventDrag();
};

modal.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.closest("#btnModalApply")) {
    editApply(event);
  } else if (
    !event.target.closest(".modal__wrapper") ||
    event.target.closest("#btnModalClose")
  ) {
    event.preventDefault();
    closeModal();
  }
});

tasker.addEventListener("click", (event) => {
  event.preventDefault();

  if (event.target.closest(".button-edit")) {
    editNote(event);
  } else if (event.target.closest(".button-next")) {
    moveNote(event);
  } else if (event.target.closest(".button-remove")) {
    removeNote(event);
  }
});

// functions drag and drop
function dragStart(event) {
  const list = event.target.closest(".wrapper"); // откуда взяли (list)
  const listCard = event.target.closest(".list__card");
  const listWrapId = list.getAttribute("id"); // какой массив
  const title = listCard.querySelector(".note-name").textContent;
  const description = listCard.querySelector(".note-description").textContent;

  searchIndex(listWrapId, title, description);

  cutArrayValue(listWrapId);
  listId = listWrapId;

  this.className += " hold";
  setTimeout(() => (this.className = "invisible"), 0);
  listCard.setAttribute("data-drag", "drag");
}

function dragEnd() {
  this.className = "list__card";

  if (!(bufArray === [])) {
    pushArray(listId, bufArray[0].title, bufArray[0].description);
    bufArray = [];
    listId = 0;
  }
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

      const target = event.currentTarget;
      const list = target.querySelector(".wrapper");
      const listId = list.getAttribute("id");

      appendArrayCard(card, list);
      pushArray(listId, bufArray[0].title, bufArray[0].description);

      bufArray = [];
      listId = 0;
      break;
    }
  }
}
