const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

searchBtn.onclick = () => {
  if (searchBox.style.display === "block") {
    searchBox.style.display = "none";
  } else {
    searchBox.style.display = "block";
    searchInput.focus();
  }
};

searchInput.addEventListener("keyup", function () {
  const filter = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".name-card");

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();

    if (text.includes(filter)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
});
