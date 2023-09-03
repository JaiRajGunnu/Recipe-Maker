let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let cancelBtn = document.getElementById("cancel-btn");
let userInput = document.getElementById("user-inp");
let appId = "YOUR_API_ID";
let appKey = "YOUR_API_KEY";

searchBtn.addEventListener("click", fetchRecipes);
userInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    fetchRecipes();
  }
});

userInput.addEventListener("input", toggleCancelBtn);

function toggleCancelBtn() {
  if (userInput.value.length > 0) {
    cancelBtn.style.display = "block";
  } else {
    cancelBtn.style.display = "none";
  }
}

cancelBtn.addEventListener("click", clearSearchInput);


function clearSearchInput() {
    userInput.value = "";
    cancelBtn.style.display = "none";
  }


  function fetchRecipes() {
    let userInp = userInput.value;
    if (userInp.length == 0) {
      result.innerHTML = `<h3 style="color:red; margin:10px 5px; font-size:120%; ">Please enter an ingredient.</h3>`;
    } else {
      fetch(
        `https://api.edamam.com/search?q=${userInp}&app_id=${appId}&app_key=${appKey}`
      )    
      .then((response) => response.json())
      .then((data) => {
        let recipes = data.hits;
        if (recipes.length === 0) {
          result.innerHTML = `<h3 style="color:red; margin:10px 5px;font-size:120%;">Sorry, No recipes found.</h3>`;
        } else {
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
      