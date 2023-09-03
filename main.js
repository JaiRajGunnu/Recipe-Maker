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