# CouchDB-Express-Node
CRUD operation using CouchDB database with Node, Express and Nano module

## To begin you must install CouchDB on your local machine or other server.

## After cloning the repository do npm install and add an .env file for the following:
  - sessionKey
  - CouchDBUser
  - CouchDBPassword
  
## list of routes you can access

  /api - will land on home page
  /api/books - will get the list of books
  /api/books/list - will also get the list of books
  /api/books/author - will get the list of author with the book they created
  /api/books/create - [GET/POST] - will get the form for creating a book or create a new book
  /api/books/details/:bookID - will get a single book and its details
  /api/books/update/:bookID - [PUT] - will update an existing book
  /api/books/delete/:bookID - [DELETE] - will delete an existing book
  
