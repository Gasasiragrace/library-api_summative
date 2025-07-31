document.addEventListener("DOMContentLoaded", () => {
  loadDefaultBooks();
});

async function loadDefaultBooks() {
  searchBooks("The Hobbit");
}

async function searchBooks(defaultQuery = null) {
  const query = defaultQuery || document.getElementById("searchInput").value.trim();
  if (!query) return;

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Loading...</p>";

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    resultsDiv.innerHTML = "";
    data.docs.slice(0, 20).forEach(book => {
      const coverId = book.cover_i;
      const title = book.title || "No Title";
      const authors = book.author_name ? book.author_name.join(", ") : "Unknown";
      const year = book.first_publish_year || "N/A";
      const key = book.key || "";

      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : "https://via.placeholder.com/150x200?text=No+Cover";

      const bookDiv = document.createElement("div");
      bookDiv.className = "book";
      bookDiv.innerHTML = `
        <a href="https://openlibrary.org${key}" target="_blank">
          <img src="${coverUrl}" alt="${title}">
        </a>
        <h3>${title}</h3>
        <p><strong>Author:</strong> ${authors}</p>
        <p><strong>First Published:</strong> ${year}</p>
        <a href="https://openlibrary.org${key}" target="_blank" class="more-info-btn">More Info</a>
      `;
      resultsDiv.appendChild(bookDiv);
    });
  } catch (error) {
    resultsDiv.innerHTML = "<p>Error fetching data.</p>";
    console.error(error);
  }
}
