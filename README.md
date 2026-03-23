# 🟩 DordleX – Smart Dual Word Puzzle

## 📌 Project Overview

DordleX is a web-based word puzzle game inspired by Dordle, where players attempt to guess two hidden five-letter words simultaneously within a limited number of attempts. The application combines gameplay with learning by integrating public APIs to provide word meanings, hints, and word exploration features.

---

## 🎯 Purpose

The goal of this project is to demonstrate:

* JavaScript fundamentals and problem-solving logic
* Integration of public APIs using `fetch`
* Use of array higher-order functions (`map`, `filter`, `sort`)
* Dynamic UI rendering and responsive design

---

## 🌐 APIs Used

### 1. Datamuse API

Used for:

* Fetching valid English words
* Generating word lists for the game
* Providing hints (related words, synonyms)

🔗 https://api.datamuse.com

---

### 2. Dictionary API

Used for:

* Fetching word meanings
* Example usage
* Part of speech

🔗 https://dictionaryapi.dev

---

## 🎮 Features

### 🟩 Core Gameplay

* Dual word guessing system (Dordle-style)
* 6 attempts to guess both words
* Real-time feedback:

  * 🟩 Correct letter & position
  * 🟨 Correct letter, wrong position
  * ⬜ Incorrect letter

---

### 🌐 API-Powered Features

* Dynamic word generation using Datamuse API
* Word meanings displayed after game completion
* Smart hint system using related words

---

### ⚙️ Required Functionalities

* 🔍 Search: Look up any word and fetch its meaning
* 🎛️ Filter: Filter words by length or difficulty
* 🔃 Sort: Sort words alphabetically or by complexity

(All implemented using JavaScript array higher-order functions)

---

### ❤️ Additional Features

* Save favorite/learned words using localStorage
* Responsive UI for mobile and desktop
* Loading states for API calls

---

## 🛠️ Technologies Used

* HTML
* CSS (Tailwind CSS optional)
* JavaScript (ES6+)
* Fetch API

---

## 🚀 How to Run

1. Clone the repository
2. Open `index.html` in your browser
3. Start playing DordleX

---

## 💡 Future Improvements

* Add difficulty levels
* Add leaderboard system
* Improve animations and transitions
* Add daily challenge mode
* Add different versions of the game

---

## ✨ Final Note

DordleX is designed to be more than just a game. It combines logic, interactivity, and real-world data to create an engaging and educational user experience.
