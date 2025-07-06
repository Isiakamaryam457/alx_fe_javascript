// Array of quote objects
const quotes = [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "Happiness depends upon ourselves.", category: "Philosophy" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>${quote.text}</p>
    <p>Category: ${quote.category}</p>
  `;
}

// Function required by Step 2 — now implemented
function createAddQuoteForm() {
  
}

// Function connected to the HTML form in Step 3
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };

  quotes.push(newQuote);

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `
    <p>${newQuote.text}</p>
    <p>Category: ${newQuote.category}</p>
  `;
}

// Attach event listener to "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
