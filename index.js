window.addEventListener("load", (event) => {
  const search = document.getElementsByName("destination-search")[0];

  search.addEventListener("input", (event) => {
    console.log(event.target.value);
  });
  const dashboard = document.querySelector(".dashboard");
  const heroButton = document.querySelector(".hero-button");
  heroButton.addEventListener("click", (event) => {
    dashboard.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "smooth",
    });
  });
});
