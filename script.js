document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const toolSections = document.querySelectorAll(".tool-section");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    toolSections.forEach(section => {
      const toolTitle = section.querySelector(".tool-header h2").textContent.toLowerCase();
      if (toolTitle.includes(query)) {
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    });
  });
});
