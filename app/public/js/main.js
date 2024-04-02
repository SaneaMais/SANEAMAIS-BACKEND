const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const pageContent = document.querySelector(".page-content");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
  pageContent.classList.toggle("hidden"); 
});

