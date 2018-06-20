const db      = require('../../../config/couch-db-context');
const request = require('request');


// request promise
let promiseRequest = async (requestData) => {
   	return new Promise((resolve, reject) => {
   		request(requestData, (error, response, books) => {
		    if(error || books.error)
		    	reject(error || { error: books.error, reason: books.reason });
		    
		    else resolve(books);
		});
   	});
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the list of books from library
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getAllBooks = async (req, res) => {
	// Request data
	const getBooks = {
	    url    : `${db.couchDB}/_design/books_library/_view/books`,
	    method : 'GET',
	    json   : true
   	} 

   	try{
   		// get list of books
   		let books = await promiseRequest(getBooks);

   		return res.status(200).json({
   		    success : true,
   		    message : "Successfully fetched a list of books.", 
   		    books   : books
   		});
   	} catch(err){
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        })
   	}
}



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the list of books from library filtered by authors
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getAllAuthors = async (req, res) => {
	// Request data
	let getAuthors = {
	    url    : `${db.couchDB}/_design/books_library/_view/authors`,
	    method : 'GET',
	    json   : true
	};

   	try{
   		// get all authors 
   		let authors = await promiseRequest(getAuthors);

   		return res.status(200).json({
   		    success : true,
   		    message : "Successfully fetched a list of authors.", 
   		    authors : authors
   		});
   	} catch(err){
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        })
   	}
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the details of a single book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getSingleBook = async (req, res) => {
	// Request data
	let getSingleBook = {
	    url    : `${db.couchDB}/${req.params.bookID}`,
	    method : 'GET',
	    json   : true
	}

   	try{
   		// get single book details
   		let bookDetails = await promiseRequest(getSingleBook);

   		return res.status(200).json({
   		    success : true,
	        message : "Successfully fetched the details of the book.", 
	        bookDetails : bookDetails
   		});
   	} catch(err){
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        })
   	}
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the form for creating new book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getCreateNewBook = (req, res) => {
	res.status(200).json({
		success: true,
		message: 'You are about to create a new book'
	});
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HTTP book for inserting or creating a new book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.postCreateNewBook = async (req, res) => {
	// Request object/body
	let bookObject = {
		Title     : req.body.title,
		Author    : req.body.author,
		Type      : req.body.type,
		ISBN      : req.body.isbn,
		dateAdded : new Date()
	}

	// Request data
	let createBook = {
	    url    : `${db.couchDB}`,
	    method : 'POST',
	    body   : bookObject,
	    json   : true
	}

   	try{
   		// create a new book details
   		let bookDetails = await promiseRequest(createBook);

	   	return res.status(200).json({
	        success : true,
	        message : "Successfully added new book.", 
	        bookDetails : bookDetails
	    });
   	} catch(err){
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        });
   	}
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HTTP put for updating an existing book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.putUpdateExistingBook = async (req, res) => {
	// Request data
	let getBookID = {
	    url    : `${db.couchDB}/${req.params.bookID}`,
	    method : 'GET',
	    json   : true
	}

	let bookDetails;

	try{
		// get single book details
		bookDetails = await promiseRequest(getBookID);
	} catch(err) {
		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        });
	}

	await updateBook(bookDetails, req, res);
}

// update book function
let updateBook = async (bookDetails, req, res) => {
	let bookObject = {
		Title     : req.body.title,
		Author    : req.body.author,
		Type      : req.body.type,
		ISBN      : req.body.isbn,
		dateUpdated : new Date()
	}

	// Request data
	let updateBook = {
	    url    : `${db.couchDB}/${bookDetails._id}`,
	    method : 'PUT',
	    qs     : { 'rev': bookDetails._rev },
	    json   : true,
	    body   : bookObject
	}

	try{
		let bookDetails = await promiseRequest(updateBook);

		return res.status(200).json({
	        success : true,
	        message : "Successfully updated book details.", 
	        bookDetails : bookDetails
	    }); 
	} catch(err){
		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        });
	}
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HTTP delete for removing an existing book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.deleteExistingBook = async (req, res) => {
	// Request data
	let getBookID = {
	    url    : `${db.couchDB}/${req.params.bookID}`,
	    method : 'GET',
	    json   : true
	}

	let bookDetails;

	try{
		// get single book details
		bookDetails = await promiseRequest(getBookID);
	} catch(err) {
		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        });
	}

	// delete a book
	await deleteBook(bookDetails, req, res);
}

// delete book function
let deleteBook = async (bookDetails, req, res) => {
	// Request data
	let deleteBook = {
	    url    : `${db.couchDB}/${bookDetails._id}`,
	    method : 'DELETE',
	    qs     : { 'rev': bookDetails._rev },
	    json   : true
	}

	try{
		let bookDetails = await promiseRequest(deleteBook);

		return res.status(200).json({
	        success : true,
	        message : "Successfully deleted a book.", 
	        bookDetails : bookDetails
	    }); 
	} catch(err){
		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        });
	}
}