const search = document.getElementsByName("destination-search")[0]

search.addEventListener("input", (event) => {
    console.log(event.target.value)
})