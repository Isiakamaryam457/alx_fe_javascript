// ✅ 1. Load quotes from localStorage or fallback to default
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "Happiness depends upon ourselves.", category: "Philosophy" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" }
];

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ✅ 2. Display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>${quote.text}</p>
    <p>Category: ${quote.category}</p>
  `;
}

// ✅ 3. Function required by Step 2 (can be left empty if unused)
function createAddQuoteForm() {
  // Required by instruction, left as a placeholder
}

// ✅ 4. Add new quote to array, update DOM, use createElement/appendChild
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText.trim() === '' || quoteCategory.trim() === '') return;

  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };

  // Add to array
  quotes.push(newQuote);

  // Save updated quotes array to localStorage
  localStorage.setItem('quotes', JSON.stringify(quotes));

  // ✅ Clear previous content
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  // ✅ Use createElement + appendChild to update DOM (required)
  const quoteTextElem = document.createElement('p');
  quoteTextElem.textContent = newQuote.text;

  const quoteCategoryElem = document.createElement('p');
  quoteCategoryElem.textContent = 'Category: ' + newQuote.category;

  quoteDisplay.appendChild(quoteTextElem);
  quoteDisplay.appendChild(quoteCategoryElem);
}

// ✅ Create and add a new quote
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

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  const quoteTextElem = document.createElement('p');
  quoteTextElem.textContent = newQuote.text;

  const quoteCategoryElem = document.createElement('p');
  quoteCategoryElem.textContent = 'Category: ' + newQuote.category;

  quoteDisplay.appendChild(quoteTextElem);
  quoteDisplay.appendChild(quoteCategoryElem);
}

// ✅ Export quotes as JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // pretty print
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ✅ Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      // Validate each object has text and category
      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format: Expected an array");
        return;
      }

      for (const q of importedQuotes) {
        if (!q.text || !q.category) {
          alert("Invalid quote object detected. Skipping import.");
          return;
        }
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// ✅ Event listener for Show New Quote button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);


// ✅ 5. Hook up the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);


