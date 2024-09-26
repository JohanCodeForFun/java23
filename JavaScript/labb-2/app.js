const menuContainer = document.getElementById("content");
const options = document.querySelectorAll(".options");
const loadingSpinner = document.getElementById("js-loading");
const specialsMenu = document.getElementById("specials-menu");
let isYesterday = false;

async function fetchMenuData() {
  try {
    toggleLoading(true);
    const menuResponse = await fetch("./data/menu.json");
    if (!menuResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const menuData = await menuResponse.json();

    const specialsResponse = await fetch("./data/specials.json");
    if (!specialsResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const specialsData = await specialsResponse.json();

    return { menuData, specialsData };
  } catch (error) {
    console.error("Fetch error:", error);
    return { menuData: {}, specialsData: {} };
  } finally {
    toggleLoading(false);
  }
}

function toggleLoading(isLoading) {
  if (isLoading) {
    loadingSpinner.classList.remove("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
  }
}

function displayTodaysMeal(specials) {
  const currentDay = new Date().getDay();
  const currentHour = new Date().getHours();

  console.log("Current day:", currentDay);
  console.log("Current hour:", currentHour);
  console.log("Specials data:", specials);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const displayDay = isYesterday
    ? days[(currentDay - 1 + 7) % 7]
    : days[currentDay];
  const specialsForDay = specials.weeklySpecialsMenu[displayDay];

  if (!specialsForDay) {
    console.error("No specials available for today.");
    return;
  }

  let mealType = currentHour < 14 ? "Lunch" : "Dinner";
  let meal = currentHour < 14 ? specialsForDay[0] : specialsForDay[1];

  console.log(`Displaying ${mealType}:`, meal);

  const specialsContainer = document.getElementById("specials__content");
  console.log("Specials container:", specialsContainer);

  if (!specialsContainer) {
    console.error("Specials container not found.");
    return;
  }

  specialsContainer.innerHTML = `
    <h2>${isYesterday ? "Yesterday's" : "Today's"} ${mealType}</h2>
    <div class="special">
        <h3>${meal.name}</h3>
        <p>Price: ${meal.price} kr</p>
        <p>Description: ${meal.description}</p>
        <p>Available: ${meal.time}</p>
    </div>
    <button class="button button--specials">
        ${isYesterday ? "Show Today's" : "Show Yesterday's"}
    </button>
`;

  specialsContainer.classList.add("specials__content--loaded");

  const toggleButton = document.querySelector(".button--specials");
  toggleButton.addEventListener("click", () => {
    isYesterday = !isYesterday;
    displayTodaysMeal(specials);
  });
}

function handleMenuSelection(menuData) {
  options.forEach((option) => {
    option.addEventListener("click", () => {
      const category = option.value;
      if (menuData[category]) {
        displayMenu(menuData[category]);
        setActiveOption(option);
      } else {
        console.error("Category not found:", category);
      }
    });
  });
}

function displayMenu(items) {
  menuContainer.innerHTML = "";
  items.forEach((item) => {
    const itemHTML = `
            <div class="menu-item">
                <h4>${item.name}</h4>
                <p>${item.price} kr</p>
                <p>${item.description}</p>
            </div>
        `;
    menuContainer.insertAdjacentHTML("beforeend", itemHTML);
  });
}

function handleHamburgerMenu(specialsData) {
  const hamburgerMenu = document.getElementById("menu-toggle");
  const weeklySpecialsContainer = document.getElementById("specials-menu");

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener("click", () => {
      weeklySpecialsContainer.classList.toggle("specials__menu--open");
      document.body.classList.toggle("nav-open");
      displayWeeklySpecials(specialsData);
    });
  }
}

function displayWeeklySpecials(specials) {
  specialsMenu.innerHTML = "";

  Object.keys(specials.weeklySpecialsMenu).forEach((day) => {
    const daySpecials = specials.weeklySpecialsMenu[day];
    const dayElement = document.createElement("div");
    dayElement.classList.add("weekly-special");
    dayElement.innerHTML = `
            <h3>${day}</h3>
            <h4>Lunch</h4>
            <p>${daySpecials[0].name} - ${daySpecials[0].price} kr</p>
            <p>${daySpecials[0].description}</p>
            <h4>Middag</h4>
            <p>${daySpecials[1].name} - ${daySpecials[1].price} kr</p>
            <p>${daySpecials[1].description}</p>
        `;
    specialsMenu.appendChild(dayElement);
  });
}

function setActiveOption(selectedOption) {
  options.forEach((option) => option.classList.remove("options--active"));
  selectedOption.classList.add("options--active");
}

async function init() {
  const { menuData, specialsData } = await fetchMenuData();

  displayTodaysMeal(specialsData);

  handleMenuSelection(menuData);

  handleHamburgerMenu(specialsData);
}

window.onload = init;
