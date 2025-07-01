const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
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


// Tasks using Promise callbacks

public_users.get('/books-promise', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks.then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json({ message: "Something went wrong!" });
    });
});

public_users.get('/isbn-promise/:isbn', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(books[isbn]);
    });

    getBooks.then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json({ message: "Something went wrong!" });
    });
});

public_users.get('/author-promise/:author', function (req, res) {
    const author = req.params.author;

    const getBooksByAuthor = new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        let booksByAuthor = [];

        bookKeys.forEach(key => {
            if (books[key].author === author) {
                booksByAuthor.push({ id: key, ...books[key] });
            }
        });

        resolve(booksByAuthor);
    });

    getBooksByAuthor
        .then((booksByAuthor) => {
            if (booksByAuthor.length > 0) {
                res.status(200).json(booksByAuthor);
            } else {
                res.status(404).json({ message: "Author not found!" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Something went wrong!" });
        });
});

public_users.get('/title-promise/:title', function (req, res) {
    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        let booksByTitle = [];

        bookKeys.forEach(key => {
            if (books[key].title === title) {
                booksByTitle.push({ id: key, ...books[key] });
            }
        });

        resolve(booksByTitle);
    });

    getBooksByTitle
        .then((booksByTitle) => {
            if (booksByTitle.length > 0) {
                res.status(200).json(booksByTitle);
            } else {
                res.status(404).json({ message: "Title not found!" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Something went wrong!" });
        });
});



module.exports.general = public_users;
