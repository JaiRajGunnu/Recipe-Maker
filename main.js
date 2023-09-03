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
      result.innerHTML = `<h3 style="color:red; margin:10px 5px; font-size:120%; ">Please enter an ingredient.</h3>`;}