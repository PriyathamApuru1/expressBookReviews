const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);

 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    let booksByAuthor = [];

    // Loop through each book by its key
    bookKeys.forEach(key => {
        if (books[key].author === author) {
            booksByAuthor.push({ id: key, ...books[key] });
        }
    });

    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).json({ message: "Author not found!" });
    }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    let booksByTitle = [];

    // Loop through each book by its key
    bookKeys.forEach(key => {
        if (books[key].title === title) {
            booksByTitle.push({ id: key, ...books[key] });
        }
    });

    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({ message: "Title not found!" });
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
