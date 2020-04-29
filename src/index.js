// <⚠️ DONT DELETE THIS ⚠️>
//import "./styles.css";
// <⚠️ /DONT DELETE THIS ⚠️>

const toDoForm = document.querySelector(".js-toDoForm"),
  toDoInput = toDoForm.querySelector("input"),
  toDoPending = document.querySelector(".js-toDoPending"),
  toDoFinished = document.querySelector(".js-toDoFinished");

const pending = "PENDING",
  finished = "FINISHED";

let pendingToDos = [];
let finishedToDos = [];

function deletePending(event) {
  const btn = event.target;
  const li = btn.parentNode;
  toDoPending.removeChild(li);
  const cleanPending = pendingToDos.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  pendingToDos = cleanPending;
  savePending();
}

function sendToFinished(event) {
  const li = event.target.parentNode;
  const moveDown = pendingToDos.filter(function (toDo) {
    return toDo.id === parseInt(li.id);
  });
  const data = moveDown[0];
  paintFinished(data.text);
  saveFinished();
  deletePending(event);
}

function deleteFinished(event) {
  const btn = event.target;
  const li = btn.parentNode;
  toDoFinished.removeChild(li);
  const cleanFinished = finishedToDos.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  finishedToDos = cleanFinished;
  saveFinished();
}

function unDo(event) {
  const li = event.target.parentNode;
  const moveUp = finishedToDos.filter(function (toDo) {
    return toDo.id === parseInt(li.id);
  });
  const data = moveUp[0];
  paintPending(data.text);
  deleteFinished(event);
}

function savePending() {
  localStorage.setItem(pending, JSON.stringify(pendingToDos));
}

function saveFinished() {
  localStorage.setItem(finished, JSON.stringify(finishedToDos));
}

function paintPending(text) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const checkBtn = document.createElement("button");
  const span = document.createElement("span");
  const newId = Math.floor((1 + Math.random()) * Date.now());
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deletePending);
  checkBtn.innerText = "✅";
  checkBtn.addEventListener("click", sendToFinished);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(checkBtn);
  li.id = newId;
  toDoPending.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId,
  };
  pendingToDos.push(toDoObj);
  savePending();
}

function paintFinished(text) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const unDoBtn = document.createElement("button");
  const span = document.createElement("span");
  const newId = Date.now();
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteFinished);
  unDoBtn.innerText = "⏪";
  unDoBtn.addEventListener("click", unDo);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(unDoBtn);
  li.id = newId;
  toDoFinished.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId,
  };
  finishedToDos.push(toDoObj);
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = toDoInput.value;
  paintPending(currentValue);
  toDoInput.value = "";
}

function loadPending() {
  const loadedPending = localStorage.getItem(pending);
  if (loadedPending !== null) {
    const parsedPending = JSON.parse(loadedPending);
    parsedPending.forEach(function (toDo) {
      paintPending(toDo.text);
    });
  }
}

function loadFinished() {
  const loadedFinished = localStorage.getItem(finished);
  if (loadedFinished !== null) {
    const parsedFinished = JSON.parse(loadedFinished);
    parsedFinished.forEach(function (toDo) {
      paintFinished(toDo.text);
    });
  }
}

function init() {
  loadPending();
  loadFinished();
  toDoForm.addEventListener("submit", handleSubmit);
}

init();
