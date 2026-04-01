async function searchMeals() {
  const query = document.getElementById("searchBox").value.trim();

  const loading = document.getElementById("loading");
  const container = document.getElementById("recipes");

  if (query === "") {
    container.innerHTML = "<p>Please enter something</p>";
    return;
  }

  loading.style.display = "block";
  container.innerHTML = "";

  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=" + query
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    loading.style.display = "none";

    if (!data.meals) {
      container.innerHTML = "<p>No recipes found</p>";
      return;
    }

    displayMeals(data.meals);

  } catch (error) {
    console.log(error);
    loading.style.display = "none";
    container.innerHTML = "<p>Error fetching data</p>";
  }
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
      <button onclick="showRecipe('${meal.idMeal}')">View Recipe</button>
    `;

    container.appendChild(div);
  });
}

async function showRecipe(id) {
  try {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );
    const data = await res.json();

    alert(data.meals[0].strInstructions);
  } catch {
    alert("Error loading recipe");
  }
}
