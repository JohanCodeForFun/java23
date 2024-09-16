/* console.log("Labb 2")
console.log("Lycka till!") */

const menuContainer = document.getElementById("content");
const options = document.querySelectorAll(".options");
const loadingSpinner = document.getElementById("js-loading");
const specialsMenu = document.getElementById("specials-menu");

// Function to fetch menu data
async function fetchMenuData() {
    try {
        toggleLoading(true); // Show loading spinner
        const menuResponse = await fetch('./data/menu.json');
        if (!menuResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const menuData = await menuResponse.json();
        
        // Mockup specials data if needed
        const specialsData = {}; // Define or fetch this data accordingly

        return { menuData, specialsData };
    } catch (error) {
        console.error('Fetch error:', error);
        return { menuData: {}, specialsData: {} };
    } finally {
        toggleLoading(false); // Hide loading spinner
    }
}

// Function to toggle the loading spinner
function toggleLoading(isLoading) {
    if (isLoading) {
        loadingSpinner.style.display = 'block';
    } else {
        loadingSpinner.style.display = 'none';
    }
}

// Function to display today's meal
function displayTodaysMeal(specials) {
    // Implement displaying today's meal based on `specials`
}

// Function to display yesterday's special
function displayYesterdaysSpecial(specials) {
    // Implement displaying yesterday's special based on `specials`
}

// Function to handle menu selection
function handleMenuSelection(menuData) {
    options.forEach(option => {
        option.addEventListener("click", () => {
            const category = option.value;
            if (menuData[category]) {
                displayMenu(menuData[category]);
                setActiveOption(option);
            } else {
                console.error('Category not found:', category);
            }
        });
    });
}

// Function to display weekly specials in the hamburger menu
function displayWeeklySpecials(specials) {
    // Implement displaying weekly specials based on `specials`
}

// Function to handle the hamburger menu and weekly specials
function handleHamburgerMenu(specialsData) {
    // Implement hamburger menu handling and displaying weekly specials
}

// Function to display the menu
function displayMenu(items) {
    menuContainer.innerHTML = ""; // Clear the previous menu
    items.forEach(item => {
        const itemHTML = `
            <div class="menu-item">
                <h4>${item.name}</h4>
                <p>${item.price} kr</p>
                <p>${item.description}</p>
            </div>
        `;
        menuContainer.insertAdjacentHTML('beforeend', itemHTML);
    });
}

// Function to set the active menu option
function setActiveOption(selectedOption) {
    options.forEach(option => option.classList.remove("options--active"));
    selectedOption.classList.add("options--active");
}

// Initialize functionality
async function init() {
    const { menuData, specialsData } = await fetchMenuData();
    
    // Display today's special
    displayTodaysMeal(specialsData);

    // Handle menu selection (Grill, Snacks, Drycker)
    handleMenuSelection(menuData);

    // Handle hamburger menu and weekly specials
    handleHamburgerMenu(specialsData);

    // Handle yesterday's special
    const yesterdaysButton = document.querySelector('.button--specials');
    if (yesterdaysButton) {
        yesterdaysButton.addEventListener('click', () => displayYesterdaysSpecial(specialsData));
    }
}

// Run the initialization function on page load
window.onload = init;

