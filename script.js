let allMeals = [];
let favorites = [];


window.onload = function () {
  loadHomeMeals();
};

async function loadHomeMeals() {
  const keywords = ["cake", "dessert", "pasta", "bread", "cheese"];

  try {
    const results = await Promise.all(
      keywords.map(word =>
        fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + word)
          .then(res => res.json())
      )
    );

    let meals = results.flatMap(r => r.meals || []);

   
    meals = meals.filter(meal =>
      meal.strCategory !== "Beef" &&
      meal.strCategory !== "Chicken" &&
      meal.strCategory !== "Seafood"
    );

    allMeals = meals;

    fillCategories(allMeals);
    displayMeals(allMeals);

  } catch {
    document.getElementById("recipes").innerHTML = "Error loading recipes";
  }
}


async function searchMeals() {
  const query = document.getElementById("searchBox").value.trim();
  if (query === "") return;

  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + query
  );
  const data = await res.json();

  if (!data.meals) {
    document.getElementById("recipes").innerHTML = "No recipes found";
    return;
  }

  allMeals = data.meals;
  fillCategories(allMeals);
  applyFilters();
}


function fillCategories(meals) {
  const select = document.getElementById("filterCategory");

  const categories = [
    "all",
    ...new Set(meals.map(meal => meal.strCategory))
  ];

  select.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");
}


function applyFilters() {
  let filtered = [...allMeals];

  const category = document.getElementById("filterCategory").value;
  const sortOption = document.getElementById("sortOption").value;

  if (category !== "all") {
    filtered = filtered.filter(meal => meal.strCategory === category);
  }

  if (sortOption === "asc") {
    filtered.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
  } else if (sortOption === "desc") {
    filtered.sort((a, b) => b.strMeal.localeCompare(a.strMeal));
  }

  displayMeals(filtered);
}


function displayMeals(meals) {
  const container = document.getElementById("recipes");
  container.innerHTML = "";

  meals.forEach(meal => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <img src="${meal.strMealThumb}">
      <h3>${meal.strMeal}</h3>
      <p>${meal.strCategory}</p>
      <button onclick="showRecipe('${meal.idMeal}')">View</button>
      <button onclick="addFavorite('${meal.strMeal}')">❤️</button>
    `;

    container.appendChild(div);
  });
}


function addFavorite(name) {
  favorites.push(name);
  alert(name + " added to favorites!");
}


async function showRecipe(id) {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const data = await res.json();

  alert(data.meals[0].strInstructions);
}
