const db      = require('../../../config/couch-db-context');
const request = require('request');


// request promise
let promiseRequest = (requestData) => {
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
module.exports.getAllBooks = (req, res) => {
	// Request data
	const getBooks = {
	    url    : `${db.couchDB}/_design/books_library/_view/books`,
	    method : 'GET',
	    json   : true
   	} 

   	promiseRequest(getBooks).then(books => {
   		return res.status(200).json({
   		    success : true,
   		    message : "Successfully fetched a list of books.", 
   		    books   : books
   		});
   	}).catch(err => {
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        })
   	});
}



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the list of books from library filtered by authors
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getAllAuthors = (req, res) => {
	// Request data
	let getAuthors = {
	    url    : `${db.couchDB}/_design/books_library/_view/authors`,
	    method : 'GET',
	    json   : true,
	    qs     : { 'key': `"${req.query.author}"`}
	};

	promiseRequest(getAuthors).then(authors => {
   		return res.status(200).json({
   		    success : true,
   		    message : "Successfully fetched a list of authors.", 
   		    authors : authors
   		});
   	}).catch(err => {
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        })
   	});
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the details of a single book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getSingleBook = (req, res) => {
	// Request data
	let getSingleBook = {
	    url    : `${db.couchDB}/${req.params.bookID}`,
	    method : 'GET',
	    json   : true
	}

	promiseRequest(getSingleBook).then(bookDetails => {
   		return res.status(200).json({
   		    success : true,
	        message : "Successfully fetched the details of the book.", 
	        book    : bookDetails
   		});
   	}).catch(err => {
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        })
   	});
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
module.exports.postCreateNewBook = (req, res) => {
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

   	promiseRequest(createBook).then(bookDetails => {
   		return res.status(200).json({
   		    success : true,
	        message : "Successfully added new book.", 
	        bookDetails : bookDetails
   		});
   	}).catch(err => {
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        })
   	});
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HTTP put for updating an existing book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.putUpdateExistingBook = (req, res) => {
	// Request data
	let getBookID = {
	    url    : `${db.couchDB}/${req.params.bookID}`,
	    method : 'GET',
	    json   : true
	}

	promiseRequest(getBookID)
	.then(bookDetails => bookDetails)
	.then(bookDetails => updateBook(bookDetails, req, res))
	.catch(err => {
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        });
   	});
}

// update book function
let updateBook = (bookDetails, req, res) => {
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

   	promiseRequest(updateBook).then(bookDetails => {
   		return res.status(200).json({
   		    success : true,
	        message : "Successfully updated a book details.", 
	        bookDetails : bookDetails
   		});
   	}).catch(err => {
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        })
   	});
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HTTP delete for removing an existing book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.deleteExistingBook = (req, res) => {
	// Request data
	let getBookID = {
	    url    : `${db.couchDB}/${req.params.bookID}`,
	    method : 'GET',
	    json   : true
	}

	promiseRequest(getBookID)
	.then(bookDetails => bookDetails)
	.then(bookDetails => deleteBook(bookDetails, req, res))
	.catch(err => {
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        });
   	});
}

// delete book function
let deleteBook = (bookDetails, req, res) => {
	// Request data
	let deleteBook = {
	    url    : `${db.couchDB}/${bookDetails._id}`,
	    method : 'DELETE',
	    qs     : { 'rev': bookDetails._rev },
	    json   : true
	}

	promiseRequest(deleteBook).then(bookDetails => {
   		return res.status(200).json({
   		    success : true,
	        message : "Successfully deleted a book.", 
	        bookDetails : bookDetails
   		});
   	}).catch(err => {
   		return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.", 
            error: err
        })
   	});
}