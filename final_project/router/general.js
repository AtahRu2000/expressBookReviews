const express = require('express');
let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");
const public_users = express.Router();
//const app=express();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
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

  let book= JSON.stringify(books,null,4);
  return res.status(200).json({message: "List of Books "} + book);
 
});
/*
public_users.get('/',function (req, res) {

  let getbookPromise= new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(books);
      },6000)
     getbookPromise.then((booksList) => {
        return res.status(200).json({message: "List of Books ", book :booksList});
    }).catch((error) => {
        console.error("Error al obtener la lista de libros:", error);
        return res.status(500).json({ message: "Error retrieving book list.", error: error });
    });
  })
});
*


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn;
  return res.status(300).json({message:"Book is ", book: books[isbn]});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let rqauthor=req.params.author;
  let founbooks=[];
  Object.values(books).forEach(book =>{
    if (rqauthor == book.author){
        founbooks.push(book);
    }  
  })
  if (founbooks.length > 0){
    return res.status(200).json({message: "Books found for that author are ", book:founbooks});
  }else{
    return res.status(404).json({message: 'No book was found for ${rqauthor}'});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let rqtitle=decodeURIComponent(req.params.title);
  let foundtitle=[];
  Object.values(books).forEach(book => {
    if (rqtitle.toLowerCase()==book.title.toLowerCase()){
        foundtitle.push(book);
    }
  })
  if (foundtitle.length>0){
    return res.status(200).json({message: "Books found with that Title are ", title:foundtitle});
  }else{
    return res.status(404).json({message: "There are no books with that Title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn;
  let review=books[isbn].reviews;
  return res.status(200).json({message: "Reviews are ", reviews: review});
});


module.exports.general = public_users;
