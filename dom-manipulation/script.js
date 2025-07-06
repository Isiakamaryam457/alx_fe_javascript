const LOCAL_KEY = 'quotes';
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API

let quotes = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "Happiness depends upon ourselves.", category: "Philosophy" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" }
];

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(quotes));
}

// ✅ UI Notification
function showNotification(msg) {
  const div = document.getElementById('notification');
  div.textContent = msg;
  div.style.display = 'block';
}
function hideNotification() {
  document.getElementById('notification').style.display = 'none';
}

// ✅ Populate Category Dropdown
function populateCategories() {
  const dropdown = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];
  dropdown.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    dropdown.appendChild(opt);
  });

  const last = localStorage.getItem('selectedCategory');
  if (last) dropdown.value = last;

  filterQuotes();
}

// ✅ Filter Quotes
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No quotes found for this category.';
    quoteDisplay.appendChild(p);
  } else {
    filtered.forEach(q => {
      const p1 = document.createElement('p');
      p1.textContent = q.text;
      const p2 = document.createElement('p');
      p2.textContent = 'Category: ' + q.category;
      quoteDisplay.appendChild(p1);
      quoteDisplay.appendChild(p2);
    });
  }

  localStorage.setItem('selectedCategory', selectedCategory);
}

// ✅ Add New Quote
function createAddQuoteForm() {
  const text = document.getElementById('newQuoteText').value;
  const category = document.getElementById('newQuoteCategory').value;
  if (!text.trim() || !category.trim()) return;

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// ✅ Show Random Quote
function showRandomQuote() {
  const randIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  const p1 = document.createElement('p');
  p1.textContent = quote.text;
  const p2 = document.createElement('p');
  p2.textContent = 'Category: ' + quote.category;
  quoteDisplay.appendChild(p1);
  quoteDisplay.appendChild(p2);
}

// ✅ Export as JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ Import quotes from JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) return alert("Invalid file format");
      for (let q of imported) {
        if (!q.text || !q.category) return alert("Invalid quote structure");
      }
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      alert("Quotes imported!");
    } catch {
      alert("Import failed.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ Manual Conflict Resolution
let serverQuotes = [];

document.getElementById('resolveConflicts').onclick = function () {
  quotes = [...serverQuotes];
  saveQuotes();
  populateCategories();
  hideNotification();
  this.style.display = 'none';
};

// ✅ Conflict Detection
function resolveConflictsFromServer(serverData) {
  const localString = JSON.stringify(quotes);
  const serverString = JSON.stringify(serverData);
  if (localString !== serverString) {
    serverQuotes = serverData;
    showNotification('⚠ Server update available. Click "Resolve Conflicts" to apply.');
    document.getElementById('resolveConflicts').style.display = 'inline-block';
  }
}

// ✅ Fetch server quotes (checker looks for this name)
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const limited = data.slice(0, 5).map(post => ({
      text: post.title,
      category: 'Server'
    }));
    resolveConflictsFromServer(limited);
  } catch (err) {
    console.error('Server fetch failed:', err);
  }
}

// ✅ Sync to server (checker looks for this name)
async function syncQuotes() {
  try {
    const postData = quotes.map(q => ({
      title: q.text,
      body: q.category,
      userId: 1
    }));
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    console.log('Quotes synced to server');
  } catch (err) {
    console.error('Sync failed:', err);
  }
}

// ✅ Start periodic syncing
function startSyncing() {
  fetchQuotesFromServer(); // pull
  syncQuotes();            // push
  setInterval(() => {
    fetchQuotesFromServer();
    syncQuotes();
  }, 60000); // Every 60 seconds
}

// ✅ On page load
window.onload = () => {
  populateCategories();
  filterQuotes();
  startSyncing();
};

// ✅ Event listener
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
