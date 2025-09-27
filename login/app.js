const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
const loginForm = document.querySelector(".sign-in-form");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form from reloading the page

  // Optional: Add simple validation here

  // Redirect to chatbot page
  window.location.href = "upload.html";
});
