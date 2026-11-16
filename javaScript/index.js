//Import Data
import data from "../data/data.json" with { type: "json" };

//DOM Elements
const dataContainer = document.querySelector("#data-container");
const html = document.querySelector("html");
const buttonChangeTheme = document.querySelector(".header__button-icon");
const activeButton = document.querySelector("#active-button");
const inactiveButton = document.querySelector("#inactive-button");
const allButton = document.querySelector("#all-button");

//Global Variables
let currentFilter = "all";

//Theme Functions
const changeThemeHandler = () => {
  buttonChangeTheme.innerHTML = "";
  if (theme === "light") {
    theme = "dark";
    saveDataTolocalStorage(theme, "theme");
    buttonChangeTheme.innerHTML = ' <i class="fas fa-sun"></i>';
    html.classList.add("dark");
  } else {
    theme = "light";
    saveDataTolocalStorage(theme, "theme");
    buttonChangeTheme.innerHTML = ' <i class="fas fa-moon"></i>';
    html.classList.remove("dark");
  }
};
const setThemeHandler = () => {
  if (theme === "dark") {
    html.classList.add("dark");
    buttonChangeTheme.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    html.classList.remove("dark");
    buttonChangeTheme.innerHTML = '<i class="fas fa-moon"></i>';
  }
};
//Local Storage Functions
const saveDataTolocalStorage = (value, key) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const getDataFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
};
// Global Variables
let theme = getDataFromLocalStorage("theme") || "light";
let myData =
  getDataFromLocalStorage("myData") || data.map((item) => ({ ...item }));
//Render Functions
const renderProducts = (products) => {
  dataContainer.innerHTML = "";

  products.forEach((product) => {
    dataContainer.insertAdjacentHTML(
      "beforeend",
      `
         <div class="col-12 col-md-6 col-lg-4">
              <div class="main__card p-3">
                <div class="main__card-contect">
                  <img
                    src=${product.logo}
                    alt=${product.name}
                    class="main__card-img"
                  />
                  <div class="main__card-dec">
                    <span class="main__card-title">${product.name}</span>
                    <p class="main__card-text">
                      ${product.description}
                    </p>
                  </div>
                </div>
                <div class="main__card-bottom">
                  <button class="main__card-btn" data-id="${product.id}">Remove</button>
                  <label class="toggle-switch">
                    <input class="btn-checkbox" type="checkbox" 
                    data-id="${product.id}"
                    ${product.isActive ? "checked" : ""}
                    />
                      <span class="toggle-switch__slider" ></span>
                    </label>
                </div>
              </div>
            </div>
        `,
    );
  });
};

//Filter Functions
const showAllProducts = () => {
  currentFilter = "all";
  changeClassStatusBtnsHandler(allButton);
  renderProducts(myData);
};
const showActiveProducts = () => {
  currentFilter = "active";
  changeClassStatusBtnsHandler(activeButton);
  const activeProducts = myData.filter((product) => product.isActive);
  renderProducts(activeProducts);
};
const showInActiveProducts = () => {
  currentFilter = "inactive";
  changeClassStatusBtnsHandler(inactiveButton);
  const inActiveProducts = myData.filter((product) => !product.isActive);
  renderProducts(inActiveProducts);
};
const changeClassStatusBtnsHandler = (selectedButton) => {
  const statusButtons = document.querySelectorAll(".main__button");
  statusButtons.forEach((button) => {
    button.classList.remove("active-btn");
  });
  selectedButton.classList.add("active-btn");
};
//Change Status Functions
dataContainer.addEventListener("change", (event) => {
  if (!event.target.matches(".btn-checkbox")) return;
  changeProductsStatusHandler(event);
});
const changeProductsStatusHandler = (event) => {
  const id = Number(event.target.dataset.id);
  const isChecked = event.target.checked;
  const product = myData.find((item) => item.id === id);
  product.isActive = isChecked;

  saveDataTolocalStorage(myData, "myData");
  if (currentFilter === "all") {
    showAllProducts();
  } else if (currentFilter === "active") {
    showActiveProducts();
  } else {
    showInActiveProducts();
  }
};
//Remove Functions
dataContainer.addEventListener("click", (event) => {
  if (!event.target.matches(".main__card-btn")) return;
  removeProductHandler(event);
});
const removeProductHandler = (event) => {
  const selectedProduct = Number(event.target.dataset.id);
  myData = myData.filter((item) => item.id !== selectedProduct);
  saveDataTolocalStorage(myData, "myData");
  if (currentFilter === "all") {
    showAllProducts();
  } else if (currentFilter === "active") {
    showActiveProducts();
  } else {
    showInActiveProducts();
  }
};
//Event Listeners
allButton.addEventListener("click", showAllProducts);
activeButton.addEventListener("click", showActiveProducts);
inactiveButton.addEventListener("click", showInActiveProducts);
buttonChangeTheme.addEventListener("click", changeThemeHandler);

//Initial Setup
window.addEventListener("load", () => {
  showAllProducts();
  setThemeHandler();
});
