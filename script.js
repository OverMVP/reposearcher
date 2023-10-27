// Get nodes

const input = document.querySelector(".custom-input");
const removeBtn = document.querySelector(".b");
const itemsList = document.querySelector(".repos-wrapper");
const inputContainer = document.querySelector(".input-container");
const test = document.querySelector(".listener");
const _TIMER = 400;
let flag = true;
let counter = 0;

// Debounce func

function debounce(fn, t) {
  let timeout;
  return function (...args) {
    if (!flag) {
      return;
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.call(this, ...args);
    }, t);
  };
}

//Получаем репозитории и вызываем renderPopup
function getRepos(event) {
  const { value } = event.target;
  value.trim();
  if (value === "") {
    return;
  }
  if (!flag) {
    throw Error("");
  }
  flag = false;
  fetch(`https://api.github.com/search/repositories?q=${value}`)
    .then((r) => r.json())
    .then((r) => {
      flag = true;
      renderPopup(r.items);
    })
    .catch((err) => alert(`ERR403: Превышен лимит запросов!`));
}

//Рендерим поп-ап с пятью элементами и при нажатии на элемент триггерит функцию добавления
//репозитория
function renderPopup(items) {
  const arr = items;
  const pop_wrapper = document.createElement("ul");
  pop_wrapper.classList.add("popup-wrapper");
  inputContainer.appendChild(pop_wrapper);

  input.addEventListener("keydown", (e) => {
    pop_wrapper.remove();
  });

  for (let i = 0; i < 5; i++) {
    const item = arr[i];
    if (arr.length >= 1) {
      const pop = document.createElement("button");
      pop.classList.add("popup");
      pop.innerHTML = `📁${item.name} | 👤 ${item.owner.login} | ⭐ ${item.stargazers_count}`;
      pop_wrapper.appendChild(pop);
    }
  }
}

//Add new Repo to the Repositories List + CleanUp the input form
function addNewRepo(innerHTML) {
  if (counter < 5) {
    ++counter;
    const newRepo = document.createElement("ul");
    newRepo.classList.add("repo");
    itemsList.appendChild(newRepo);
    const liInsideRepo = document.createElement("li");
    newRepo.appendChild(liInsideRepo);
    const newDiv = document.createElement("div");
    newDiv.classList.add("li-info");
    liInsideRepo.appendChild(newDiv);
    const newBtnWrapper = document.createElement("div");
    newBtnWrapper.classList.add("btn-wrapper");
    liInsideRepo.appendChild(newBtnWrapper);
    const newRemoveBtn = document.createElement("button");
    newRemoveBtn.classList.add("b");
    newBtnWrapper.appendChild(newRemoveBtn);
    newRemoveBtn.innerText = "X";
    newDiv.insertAdjacentHTML("beforeend", `${innerHTML}`);
  } else {
    alert("Достигнуто максимальное кол-во репозиториев!");
  }
  input.value = "";
}

//Event Listener for autocomplete form
input.addEventListener("keydown", debounce(getRepos, _TIMER));

// Delete Element of Repositories List
itemsList.addEventListener("click", (e) => {
  if (e.target.className != "b") return;
  let repo = e.target.closest(".repo");
  repo.classList.add("remove");
  setTimeout(() => {
    repo.remove();
    counter--;
  }, 300);
});

// Add a Repo to Repositories List
document.body.addEventListener("click", (e) => {
  e.stopImmediatePropagation();
  if (e.target.className !== "popup") {
    return;
  }
  let wrapper = e.target.closest(".popup-wrapper");
  wrapper.remove();
  let flyForm = e.target.innerHTML.split("|");
  flyForm[0] = `<li>Repo: ${flyForm[0].slice(2)}</li>`;
  flyForm[1] = `<li>User: ${flyForm[1].slice(3)}</li>`;
  flyForm[2] = `<li>Stars: ${flyForm[2].slice(2)} ⭐</li>`;
  const innerHTML = flyForm.join("");
  addNewRepo(innerHTML);
});
