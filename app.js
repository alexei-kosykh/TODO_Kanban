const app = () => {
  const listCards = document.querySelectorAll(".list__card");
  const listes = document.querySelectorAll(".list");
  const form = document.querySelector("#form");
  const addNoteBtn = document.querySelector("#addNoteBtn");

  let notes = {
    todo: [],
    inProgress: [],
    done: [],
    remove: [],
  };

  const pushArray = (id, title, description) => {
    notes[id].push(title, description);
  };

  addNoteBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const list = event.target.closest(".list");
    listId = list.getAttribute("id");

    pushArray(listId, title, description);
  });

  // listCard listeners
  for (const card of listCards) {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
    console.log("card", card);
  }

  // Loop through emptoes and call drag events
  for (const list of listes) {
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop", dragDrop);
    console.log("list", list);
  }
};

app();

// Drag functions
function dragStart() {
  this.className += " hold";
  setTimeout(() => (this.className = "invisible"), 0);
  exampleAttr.setAttribute("data-drag", "drag");
  console.log("dragstart", this.className);
}
function dragEnd() {
  this.className = "list__card";
  exampleAttr.removeAttribute("data-drag", "drag");
  console.log("dragend", this.className);
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

function dragDrop() {
  this.className = "list";
  this.append(listCards);
}
