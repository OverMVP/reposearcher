// Get nodes

const input = document.querySelector(".custom-input");
const removeBtn = document.querySelector(".b");
const itemsList = document.querySelector(".repos-wrapper");
const inputContainer = document.querySelector(".input-container");
const test = document.querySelector(".listener");
let flag = true;
let counter = 1;

// Debounce

function debounce(fn, t) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.call(this, ...args);
    }, t);
  };
}

//Вызываем появление поп-апа
input.addEventListener("keydown", debounce(getRepos, 400));

// Удаляем добавленный репозиторий
itemsList.addEventListener("click", (e) => {
  if (e.target.className != "b") return;
  let repo = e.target.closest(".repo");
  repo.classList.add("remove");
  setTimeout(() => {
    repo.remove();
    counter--;
  }, 300);
});

//Получаем репозитории и вызываем renderPopup
async function getRepos(event) {
  const { value } = event.target;
  value.trim();
  if (value === "") {
    return;
  }
  try {
    if (!flag) {
      throw new Error("err");
    }
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${value}`
    );
    const data = await response.json();
    const items = data.items;
    renderPopup(items);
    flag = false;
    return items;
  } catch (e) {
    flag = true;
  }
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
    if (item) {
      const pop = document.createElement("button");
      pop.classList.add("popup");
      pop.innerHTML = `📁${item.name} | 👤 ${item.owner.login} | ⭐${item.stargazers_count}`;
      pop_wrapper.appendChild(pop);
      pop.addEventListener("click", (e) => {
        addNewRepo(item);
        pop_wrapper.remove();
      });
    }
  }
  flag = true;
}

//Функция добавления репозитория + очистка инпута
function addNewRepo(item = null) {
  if (counter <= 5) {
    counter++;
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
    newDiv.insertAdjacentHTML(
      "beforeend",
      `
  <div>Repo: ${item.name}</div>
  <div>User: ${item.owner.login}</div>
  <div>Stars: ${item.stargazers_count} ⭐</div>
  `
    );
  } else {
    alert("Достигнуто максимальное кол-во репозиториев!");
  }
  input.value = "";
  flag = true;
}
