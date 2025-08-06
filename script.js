document.addEventListener("DOMContentLoaded", () => {
  fetch("tools.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("tools-container");
      const search = document.getElementById("search");

      function displayTools(tools) {
        container.innerHTML = "";
        tools.forEach(tool => {
          const card = document.createElement("div");
          card.className = "tool-card";
          card.innerHTML = `
            <h3>${tool.name}</h3>
            <p><strong>Category:</strong> ${tool.category}</p>
            <p>${tool.description}</p>
            <a href="${tool.link}" target="_blank">Visit</a>
          `;
          container.appendChild(card);
        });
      }

      search.addEventListener("input", () => {
        const value = search.value.toLowerCase();
        const filtered = data.filter(tool =>
          tool.name.toLowerCase().includes(value) ||
          tool.description.toLowerCase().includes(value) ||
          tool.category.toLowerCase().includes(value)
        );
        displayTools(filtered);
      });

      displayTools(data);
    });
});
