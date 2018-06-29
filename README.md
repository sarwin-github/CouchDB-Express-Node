# CouchDB-Express-Node
CRUD operation using CouchDB database with Node, Express and Nano module

## To begin you must install CouchDB on your local machine or other server.

## After cloning the repository do npm install and add an .env file for the following:
  - sessionKey
  - CouchDBUser
  - CouchDBPassword
  
## list of routes you can access

  /api - will land on home page <br>
  /api/books - will get the list of books <br>
  /api/books/list - will also get the list of books <br>
  /api/books/author - will get the list of author with the book they created <br>
  /api/books/create - [GET/POST] - will get the form for creating a book or create a new book <br>
  /api/books/details/:bookID - will get a single book and its details <br>
  /api/books/update/:bookID - [PUT] - will update an existing book <br>
  /api/books/delete/:bookID - [DELETE] - will delete an existing book <br>
  
