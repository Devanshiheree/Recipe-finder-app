async function searchMeals() {
  const query = document.getElementById("searchBox").value;

  const loading = document.getElementById("loading");
  const container = document.getElementById("recipes");

  loading.style.display = "block";
  container.innerHTML = "";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    const data = await response.json();

    loading.style.display = "none";

    if (!data.meals) {
      container.innerHTML = "<p>No recipes found</p>";
      return;
    }

    displayMeals(data.meals);

  } catch (error) {
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
    `;

    container.appendChild(div);
  });
}
