const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
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

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
// Login endpoint
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const newReview = req.query.review;
    const username = req.session.authorization.username; 

    if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    if (!newReview) {
      return res.status(400).json({ message: "Review text is required as a query parameter (e.g., ?review=MyGreatReview)." });
    }
  
    if (!username) {
      return res.status(401).json({ message: "User not authenticated. Please log in to add a review." });
    }
    let bookReviews = books[isbn].reviews;
  
    bookReviews[username] = newReview;
    console.log(`Review for ISBN ${isbn} by ${username} updated/added:`, bookReviews[username]);
    console.log(`All reviews for ISBN ${isbn}:`, bookReviews);
    return res.status(200).json({
      message: `Review for ISBN ${isbn} by ${username} successfully added or modified.`,
      currentReviews: bookReviews 
    });
  });

  // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username; 
    const isbn = req.params.isbn;
    
    if (!username) {
      return res.status(401).json({ message: "User not authenticated. Please log in to add a review." });
    }
    if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
    let bookReviews = books[isbn].reviews;
    if (bookReviews.hasOwnProperty(username)) {
            delete bookReviews[username];
            res.status(200).json({message:"Review deleted"})
    }else{
        res.status(404).json({message:"No review was found for that user"});
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
