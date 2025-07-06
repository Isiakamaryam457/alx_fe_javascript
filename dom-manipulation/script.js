// ✅ Load from localStorage or use default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "Happiness depends upon ourselves.", category: "Philosophy" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" }
];

// ✅ Helper: Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ✅ Step 1: Populate category dropdown
function populateCategories() {
  const categorySet = new Set(quotes.map(q => q.category));
  const categoryFilter = document.getElementById('categoryFilter');

  // Clear and repopulate dropdown
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categorySet.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes();
  }
}

// ✅ Step 2: Filter and show quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    const noResult = document.createElement('p');
    noResult.textContent = 'No quotes found for this category.';
    quoteDisplay.appendChild(noResult);
  } else {
    filteredQuotes.forEach(quote => {
      const quoteTextElem = document.createElement('p');
      quoteTextElem.textContent = quote.text;

      const quoteCategoryElem = document.createElement('p');
      quoteCategoryElem.textContent = 'Category: ' + quote.category;

      quoteDisplay.appendChild(quoteTextElem);
      quoteDisplay.appendChild(quoteCategoryElem);
    });
  }

  // Save selection to localStorage
  localStorage.setItem('selectedCategory', selectedCategory);
}

// ✅ Add new quote + update dropdown if new category
function createAddQuoteForm() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText.trim() === '' || quoteCategory.trim() === '') return;

  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };

  quotes.push(newQuote);
  saveQuotes();

  // ✅ Update category dropdown
  populateCategories();

  // ✅ Refilter based on current selection
  filterQuotes();

  // ✅ Optional: clear inputs
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// ✅ Show random quote (not filtered)
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  const quoteTextElem = document.createElement('p');
  quoteTextElem.textContent = quote.text;

  const quoteCategoryElem = document.createElement('p');
  quoteCategoryElem.textContent = 'Category: ' + quote.category;

  quoteDisplay.appendChild(quoteTextElem);
  quoteDisplay.appendChild(quoteCategoryElem);
}

// ✅ Export quotes as JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ Import from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON: Expected an array.");
        return;
      }

      for (const q of importedQuotes) {
        if (!q.text || !q.category) {
          alert("Invalid quote object. Skipping import.");
          return;
        }
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch {
      alert("Failed to parse the file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// ✅ Event listener for random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// ✅ Populate categories and filter on page load
window.onload = function () {
  populateCategories();
  filterQuotes();
};
