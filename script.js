// Fetch 2 random 5-letter words
async function fetchWords() {
  const response = await fetch("https://api.datamuse.com/words?sp=?????");
  const data = await response.json();

  let words = [];

  data.forEach(function (item) {
    if (item.word.length === 5) {
      words.push(item.word);
    }
  });

  return words.slice(0, 2);
}

// Fetch meaning of a word
async function fetchMeaning(word) {
  const response = await fetch(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
  );

  const data = await response.json();

  let meaning = "Meaning not found";

  if (
    data.length > 0 &&
    data[0].meanings &&
    data[0].meanings.length > 0 &&
    data[0].meanings[0].definitions &&
    data[0].meanings[0].definitions.length > 0
  ) {
    meaning = data[0].meanings[0].definitions[0].definition;
  }

  return meaning;
}

// Display words and meanings on webpage
async function renderWords() {
  const loadingText = document.getElementById("loading");
  const wordsContainer = document.getElementById("words-container");

  loadingText.style.display = "block";

  try {
    const words = await fetchWords();

    let cardsHTML = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const meaning = await fetchMeaning(word);

      cardsHTML += `
        <div class="card">
          <h3>${word.toUpperCase()}</h3>
          <p>${meaning}</p>
        </div>
      `;
    }

    wordsContainer.innerHTML = cardsHTML;
  } catch (error) {
    wordsContainer.innerHTML = "<p>Failed to load words.</p>";
  }

  loadingText.style.display = "none";
}

// Start the app
renderWords();