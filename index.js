window.addEventListener("load", (event) => {
  const searchElement = document.getElementsByName("destination-search")[0];
  const search = debounce((query) => init(query), 300);

  searchElement.addEventListener("input", (event) => {
    search(event.target.value);
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

const debounce = (callback, ms = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => callback(...args), ms);
  };
};

async function init(query) {
  let newAutocompleteContainer = document.createElement("div");
  newAutocompleteContainer.className = "auto-complete";
  console.log(query);
  console.log(query === "");
  let searchInputContainer = document.querySelector(".search-input-container");
  if (query === "") {
    console.log("empty query");
    for (const child of searchInputContainer.children) {
      if (child.className === "auto-complete") {
        child.remove();
      }
    }
    return;
  }

  const { AutocompleteSessionToken, AutocompleteSuggestion } =
    await google.maps.importLibrary("places");

  // Add an initial request body.
  const request = {
    input: query,
    includedPrimaryTypes: ["(cities)"],
  };

  // Create a session token.
  const token = new AutocompleteSessionToken();
  // Add the token to the request.
  request.sessionToken = token;
  // Fetch autocomplete suggestions.
  const { suggestions } =
    await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

  for (const suggestion of suggestions) {
    const suggestionDiv = document.createElement("div");
    const place = suggestion.placePrediction.toPlace();
    await place.fetchFields({
      fields: ["formattedAddress"],
    });
    suggestionDiv.innerText = `${place.formattedAddress}`;
    newAutocompleteContainer.appendChild(suggestionDiv);
    suggestionDiv.className = "auto-complete-suggestion";
  }
  console.log(searchInputContainer.children);

  for (const child of searchInputContainer.children) {
    if (child.className === "auto-complete") {
      child.remove();
    }
  }

  searchInputContainer.appendChild(newAutocompleteContainer);
}
