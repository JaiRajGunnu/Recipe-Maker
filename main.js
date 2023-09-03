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
            .join("");

            result.innerHTML = recipeCards;

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
          result.innerHTML = `<h3>Error occurred while fetching recipes</h3>`;
        });
    }
  }

  function fetchRecipeDetails(recipeUri) {
    let encodedUri = encodeURIComponent(recipeUri);
    fetch(
      `https://api.edamam.com/search?r=${encodedUri}&app_id=${appId}&app_key=${appKey}`
    )
      .then((response) => response.json())
      .then((recipeData) => {
        let recipe = recipeData[0];
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


        let goBackBtn = document.getElementById("go-back-btn");
        goBackBtn.addEventListener("click", fetchRecipes);
      })

      .catch(() => {
        result.innerHTML = `<h3>Error occurred while fetching recipe details</h3>`;
      });
  }