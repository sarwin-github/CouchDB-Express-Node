const db      = require('../../../config/couch-db-context');
const request = require('request');
const async   = require('async');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the list of books from library
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getAllBooks = (req, res) => {
	// Request data
	let getBooks = {
	    url    : `${db.couchDB}/_design/books_library/_view/books`,
	    method : 'GET'
	}

	// Start the request
	request(getBooks, (error, response, books) => {
	    if(error || JSON.parse(books).error === 'not_found'){
	        return res.status(500).send({ 
	            success: false, 
	            message: "Something went wrong.", 
	            error: JSON.parse(books) 
	        });
	    }
	    res.status(200).json({
	        success : true,
	        message : "Successfully fetched a list of books.", 
	        books   : JSON.parse(books)
	    });
	}); 
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the list of books from library filtered by authors
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getAllAuthors = (req, res) => {
	// Request data
	let getAuthors = {
	    url    : `${db.couchDB}/_design/books_library/_view/authors`,
	    method : 'GET'
	}

	// Start the request
	request(getAuthors, (error, response, author) => {
	    if(error || JSON.parse(author).error === 'not_found'){
	        return res.status(500).send({ 
	            success: false, 
	            message: "Something went wrong.", 
	            error: JSON.parse(author) 
	        });
	    }
	    res.status(200).json({
	        success: true,
	        message: "Successfully fetched a list of authors.", 
	        author: JSON.parse(author)
	    });
	}); 
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the details of a single book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getSingleBook = (req, res) => {
	// Request data
	let getSingleBook = {
	    url    : `${db.couchDB}/${req.params.bookID}`,
	    method : 'GET'
	}

	// Start the request
	request(getSingleBook, (error, response, bookDetails) => {
	    if(error || JSON.parse(bookDetails).error === 'not_found'){
	        return res.status(500).send({ 
	            success: false, 
	            message: "Something went wrong.", 
	            error: JSON.parse(bookDetails) 
	        });
	    }
	    res.status(200).json({
	        success: true,
	        message: "Successfully fetched book details.", 
	        bookDetails: JSON.parse(bookDetails)
	    });
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

	// Start the request
	request(createBook, (error, response, bookDetails) => {
	    if(error){
	        return res.status(500).send({ 
	            success: false, 
	            message: "Something went wrong.", 
	            error: error
	        });
	    }
	    res.status(200).json({
	        success: true,
	        message: "Successfully added new book."
	    });
	}); 
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HTTP put for updating an existing book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.putUpdateExistingBook = (req, res) => {
	async.waterfall([
		(callback) => {
			// Request data
			let getSingleBook = {
			    url    : `${db.couchDB}/${req.params.bookID}`,
			    method : 'GET'
			}

			// Start the request
			request(getSingleBook, (error, response, bookDetails) => {
			    callback(error, JSON.parse(bookDetails))
			}); 
		}, (book, callback) => {
			let bookObject = {
				Title     : req.body.title,
				Author    : req.body.author,
				Type      : req.body.type,
				ISBN      : req.body.isbn,
				dateUpdated : new Date()
			}

			// Request data
			let updateBook = {
			    url    : `${db.couchDB}/${book._id}`,
			    method : 'PUT',
			    qs     : { 'rev': book._rev },
			    json   : true,
			    body   : bookObject
			}

			// Start the request
			request(updateBook, (error, response, bookDetails) => {
				callback(error, bookDetails)
			}); 
		}], (err, result) => {
			if(err || result.error){
				return res.status(500).json({
					success : false, 
					err     : err,
					message : 'Something went wrong.'
				});
			}

			res.status(200).json({
				success   : true, 
				message   : 'Successfully updated an existing book',
				"Details" : result
			});
		});
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HTTP delete for removing an existing book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.deleteExistingBook = (req, res) => {
	async.waterfall([
		(callback) => {
			// Request data
			let getSingleBook = {
			    url    : `${db.couchDB}/${req.params.bookID}`,
			    method : 'GET'
			}

			// Start the request
			request(getSingleBook, (error, response, bookDetails) => {
			    callback(error, JSON.parse(bookDetails))
			}); 
		}, (book, callback) => {
			// Request data
			let deleteBook = {
			    url    : `${db.couchDB}/${book._id}`,
			    method : 'DELETE',
			    qs     : { 'rev': book._rev },
			}

			// Start the request
			request(deleteBook, (error, response, bookDetails) => {
				callback(error, JSON.parse(bookDetails))
			}); 
		}], (err, result) => {
			if(err){
				return res.status(500).json({
					success : false, 
					err     : err,
					message : 'Something went wrong.'
				});
			}

			res.status(200).json({
				success   : true, 
				message   : 'Successfully deleted an existing book',
				"Details" : result
			});
		});
}