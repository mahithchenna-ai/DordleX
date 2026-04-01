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