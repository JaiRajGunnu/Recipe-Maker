// Get DOM elements
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let cancelBtn = document.getElementById("cancel-btn");
let userInput = document.getElementById("user-inp");

// Replace these with your own API credentials
let appId = "YOUR_API_ID";
let appKey = "YOUR_API_KEY";

// Event listener for the search button
searchBtn.addEventListener("click", fetchRecipes);

// Event listener for pressing Enter key in the input field
userInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    fetchRecipes();
  }
});

// Event listener for input changes in the search field
userInput.addEventListener("input", toggleCancelBtn);

// Function to toggle the cancel button based on input length
function toggleCancelBtn() {
  if (userInput.value.length > 0) {
    cancelBtn.style.display = "block";
  } else {
    cancelBtn.style.display = "none";
  }
}

// Event listener for the cancel button to clear search input
cancelBtn.addEventListener("click", clearSearchInput);

// Function to clear the search input
function clearSearchInput() {
  userInput.value = "";
  cancelBtn.style.display = "none";
}

// Function to fetch recipes based on user input
function fetchRecipes() {
  let userInp = userInput.value;
  if (userInp.length == 0) {
    // Display an error message if no input is provided
    result.innerHTML = `<h3 style="color:red; margin:10px 5px; font-size:120%; ">Please enter an ingredient.</h3>`;
  } else {
    // Fetch recipes using the Edamam API
    fetch(
      `https://api.edamam.com/search?q=${userInp}&app_id=${appId}&app_key=${appKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        let recipes = data.hits;
        if (recipes.length === 0) {
          // Display a message if no recipes are found
          result.innerHTML = `<h3 style="color:red; margin:10px 5px;font-size:120%;">Sorry, No recipes found.</h3>`;
        } else {
          // Create recipe cards and display them
          let recipeCards = recipes
            .map((recipe, index) => {
              let recipeData = recipe.recipe;
              return `
                <div class="recipe-card">
                  <img class="recp-img" src="${recipeData.image}" alt="${recipeData.label}">
                  <div class="recipe-info">
                    <h2>${recipeData.label}</h2>
                    <p>Source: ${recipeData.source}</p>
                    <button class="view-recipe-btn" data-uri="${recipeData.uri}">View Recipe <i class="fa-solid fa-arrow-right" style="margin-left:04px; transform: rotateZ(330deg); "></i></button>
                  </div>
                </div>
              `;
            })
            .join("");

          result.innerHTML = recipeCards;

          // Add event listeners to view recipe buttons
          let viewRecipeBtns = document.getElementsByClassName("view-recipe-btn");
          Array.from(viewRecipeBtns).forEach((btn) => {
            btn.addEventListener("click", () => {
              let recipeUri = btn.dataset.uri;
              fetchRecipeDetails(recipeUri);
            });
          });
        }
      })
      .catch(() => {
        // Handle errors while fetching recipes
        result.innerHTML = `<h3>Error occurred while fetching recipes</h3>`;
      });
  }
}

// Function to fetch recipe details based on a recipe URI
function fetchRecipeDetails(recipeUri) {
  let encodedUri = encodeURIComponent(recipeUri);
  fetch(
    `https://api.edamam.com/search?r=${encodedUri}&app_id=${appId}&app_key=${appKey}`
  )
    .then((response) => response.json())
    .then((recipeData) => {
      let recipe = recipeData[0];

      // Display recipe details
      result.innerHTML = `
        <div class="recipe-details">
          <h1>${recipe.label}</h1>
          <center>
            <img class="recp-img" src="${recipe.image}" alt="${recipe.label}"  style="width:300px; box-shadow: 6px 7px 4px rgb(0 0 0 / 40%);">
          </center>
          <p style="margin:5px 0;"> <i class="fa-solid fa-arrow-right" style="margin-right:7px; font-size:14px;"></i> Source: ${recipe.source}</p>
          <p style="margin:5px 0;"> <i class="fa-solid fa-arrow-right" style="margin-right:7px; font-size:14px;"></i> Servings: ${recipe.yield}</p>
          <b><h3 style="text-align: left; margin-top:15px;">Ingredients</h3></b>
          <ul>
            ${recipe.ingredients.map((ingredient) => `<li>${ingredient.text}</li>`).join("")}
          </ul>
          <b><h3 style="text-align: left; margin-top:15px;">Instructions</h3></b>
          <p class="recp-url"><a href="${recipe.url}" target="_blank">${recipe.url}  <i class="fa-solid fa-arrow-up-right-from-square" style="margin-left:04px; font-size:14px;"></i></a> </p>
          <p style="opacity:85%; color:black; font-size:14px;margin:5px 0;"> <i> ( Follow the link for detailed and complete instructions. ) </i></p>
          <button id="go-back-btn"><i class="fa-sharp fa-solid fa-chevron-left" style="margin-right:7px;"></i>Back</button>
        </div>
      `;

      // Add event listener to the "Go Back" button
      let goBackBtn = document.getElementById("go-back-btn");
      goBackBtn.addEventListener("click", fetchRecipes);
    })
    .catch(() => {
      // Handle errors while fetching recipe details
      result.innerHTML = `<h3>Error occurred while fetching recipe details</h3>`;
    });
}
