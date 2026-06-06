let introTriggered = false;

window.addEventListener("load", (event) => {
	const searchElement = document.getElementsByName("destination-search")[0];
	const search = debounce((query) => init(query), 100);

	searchElement.addEventListener("input", (event) => {
		search(event.target.value);
	});
	const dashboard = document.querySelector(".dashboard");
});
// ************************* INTRO SEQUENCE *************************

const startIntro = () => {
	if (introTriggered) {
		return;
	}
	introTriggered = true;
	const hero = document.querySelector(".hero-container");
	const dashboard = document.querySelector(".dashboard");
	document.body.style.overflow = "hidden";
	hero.classList.add("hero-out");
	hero.addEventListener(
		"animationend",
		() => {
			console.log("transition ended ");
			hero.remove();
			dashboard.classList.add("dashboard-in");
			document.body.style.overflow = "";
		},
		{ once: true },
	);
};
// scoll happens automatically
// TODO: figure out why this happens
// window.addEventListener(
// 	"scroll",
// 	() => {
// 		console.log("scroll");
// 		startIntro();
// 	},
// 	{ passive: false, once: true },
// );

window.addEventListener(
	"wheel",
	(event) => {
		event.preventDefault();
		startIntro();
	},
	{ passive: false, once: true },
);

window.addEventListener(
	"keydown",
	(event) => {
		if (["ArrowDown", "PageDown", " " /*space*/].includes(event.key)) {
			event.preventDefault();
			startIntro();
		}
	},
	{ passive: false, once: true },
);
const heroButton = document.querySelector(".hero-button");
heroButton.addEventListener(
	"click",
	(event) => {
		startIntro();
	},
	{ once: true },
);
// ******************************************************************

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
	let searchInputContainer = document.querySelector(
		".search-input-container",
	);
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
