const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username || req.query.username;
  const password = req.body.password || req.query.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Unable to register user: username and password required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registred. Now you can login" });
});

// Task 2 & Task 10: Get the book list available in the shop using Async/Await & Promise
public_users.get('/', async function (req, res) {
  try {
    const getBooksPromise = new Promise((resolve, reject) => {
      resolve(books);
    });
    const allBooks = await getBooksPromise;
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Task 3 & Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Task 4 & Task 12: Get book details based on author using Async/Await & Promise
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let filteredBooks = [];
      const keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          filteredBooks.push({ isbn: key, ...books[key] });
        }
      });
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject({ status: 404, message: "No books found for this author" });
      }
    });

    const matchingBooks = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

// Task 5 & Task 13: Get all books based on title using Async/Await & Promise
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      let filteredBooks = [];
      const keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          filteredBooks.push({ isbn: key, ...books[key] });
        }
      });
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject({ status: 404, message: "No books found for this title" });
      }
    });

    const matchingBooks = await getBooksByTitle;
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

// Task 6: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ==============================================================
// Task 10-13 Functions using Axios with Async/Await and Promises
// ==============================================================

// Task 10: Get all books using async/await with Axios
async function getAllBooksAxios(url = "http://localhost:5000/") {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching all books with Axios:", error.message);
  }
}

// Task 11: Get book details based on ISBN using Promises with Axios
function getBookByISBNAxios(isbn, baseUrl = "http://localhost:5000/isbn/") {
  return axios.get(`${baseUrl}${isbn}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Error fetching book with ISBN ${isbn} with Axios:`, error.message);
    });
}

// Task 12: Get book details based on author using async/await with Axios
async function getBooksByAuthorAxios(author, baseUrl = "http://localhost:5000/author/") {
  try {
    const response = await axios.get(`${baseUrl}${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by author ${author} with Axios:`, error.message);
  }
}

// Task 13: Get book details based on title using async/await with Axios
async function getBooksByTitleAxios(title, baseUrl = "http://localhost:5000/title/") {
  try {
    const response = await axios.get(`${baseUrl}${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by title ${title} with Axios:`, error.message);
  }
}

module.exports.general = public_users;
module.exports.getAllBooksAxios = getAllBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
