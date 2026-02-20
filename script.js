let books = [];
let currentBook = null;
let currentChapter = null;
let bibleData = null;

const bookSelect = document.getElementById("bookSelect");
const chapterSelect = document.getElementById("chapterSelect");
const verseContainer = document.getElementById("verseContainer");
const searchInput = document.getElementById("searchInput");
const nextBtn = document.getElementById("nextChapter");
const prevBtn = document.getElementById("prevChapter");

/* ---------------- LOAD BOOK LIST ---------------- */

fetch("data/books.json")
  .then(res => res.json())
  .then(data => {
    books = data;
    loadBooks();
  });

function loadBooks() {
  bookSelect.innerHTML = '<option value="">Select Book</option>';

  books.forEach(book => {
    let option = document.createElement("option");
    option.value = book.file;
    option.textContent = book.name;
    bookSelect.appendChild(option);
  });
}

/* ---------------- WHEN BOOK CHANGES ---------------- */

bookSelect.addEventListener("change", function () {

  if (!this.value) return;

  currentBook = books.find(b => b.file === this.value);

  loadBookData();
});

/* ---------------- LOAD BOOK JSON ---------------- */

function loadBookData() {

  fetch(`data/${currentBook.file}.json`)
    .then(res => res.json())
    .then(data => {

      bibleData = data;

      loadChaptersFromJSON();

      // Auto select first available chapter
      const firstChapter = Object.keys(bibleData.chapters)[0];
      currentChapter = firstChapter;
      chapterSelect.value = firstChapter;

      displayChapter();
    });
}

/* ---------------- LOAD CHAPTERS FROM JSON ---------------- */

function loadChaptersFromJSON() {

  chapterSelect.innerHTML = "";

  const chapterKeys = Object.keys(bibleData.chapters);

  chapterKeys.forEach(ch => {
    let option = document.createElement("option");
    option.value = ch;
    option.textContent = ch;
    chapterSelect.appendChild(option);
  });
}

/* ---------------- WHEN CHAPTER CHANGES ---------------- */

chapterSelect.addEventListener("change", function () {
  currentChapter = this.value;
  displayChapter();
});

/* ---------------- DISPLAY CHAPTER ---------------- */

function displayChapter() {

  verseContainer.innerHTML = "";

  // Safety check
  if (!bibleData.chapters[currentChapter]) {
    verseContainer.innerHTML = "Chapter not found.";
    return;
  }

  let verses = bibleData.chapters[currentChapter].verses;

  Object.keys(verses).forEach(v => {

    let div = document.createElement("div");
    div.classList.add("verse");
    div.textContent = v + ". " + verses[v];

    div.onclick = function () {
      document.querySelectorAll(".verse")
        .forEach(x => x.classList.remove("selected"));

      div.classList.add("selected");
    };

    verseContainer.appendChild(div);
  });
}

/* ---------------- NEXT CHAPTER ---------------- */

nextBtn.onclick = function () {

  const chapterKeys = Object.keys(bibleData.chapters);
  let index = chapterKeys.indexOf(currentChapter);

  if (index < chapterKeys.length - 1) {
    currentChapter = chapterKeys[index + 1];
    chapterSelect.value = currentChapter;
    displayChapter();
  }
};

/* ---------------- PREVIOUS CHAPTER ---------------- */

prevBtn.onclick = function () {

  const chapterKeys = Object.keys(bibleData.chapters);
  let index = chapterKeys.indexOf(currentChapter);

  if (index > 0) {
    currentChapter = chapterKeys[index - 1];
    chapterSelect.value = currentChapter;
    displayChapter();
  }
};

/* ---------------- SEARCH ---------------- */

searchInput.addEventListener("input", function () {

  let keyword = this.value.toLowerCase();
  let verses = document.querySelectorAll(".verse");

  verses.forEach(v => {

    if (v.textContent.toLowerCase().includes(keyword)) {
      v.style.display = "block";
    } else {
      v.style.display = "none";
    }

  });
});