const db    = require('../../../config/couch-db-context');
const async = require('async');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the list of books from library
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getAllBooks = (req, res) => {
	db.couchDB.view("books_library", "books", (err, books) => { 
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Something went wrong with the server.'
			});
		} 

		res.status(200).json({
			success   : true, 
			message   : 'Successfully fetched the list of books',
			books   : books.length === 0 ? 'List of Books is currently empty.' : books
		}); 
	}); 
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the list of books from library filtered by authors
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getAllAuthors = (req, res) => {
	db.couchDB.view("books_library", "authors", (err, author) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Something went wrong with the server.'
			});
		} 

		res.status(200).json({
			success   : true, 
			message   : 'Successfully fetched the list of author',
			author    : author.length === 0 ? 'List of Authors is currently empty.' : author
		}); 
	});
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This will get the details of a single book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getSingleBook = (req, res) => {
	db.couchDB.get(req.params.bookID, (err, book) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Something went wrong with the server.'
			});
		} 

		if(!book){
			return res.status(404).json({ 
				sucess  : false, 
				error   : 'Error searching the book', 
				message : 'The Book you are looking for does not exist.'
			});
		} 

		res.status(200).json({
			success : true, 
			message : 'Successfully fetched the list of book',
			book    : book
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
// HTTP post for inserting or creating a new book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.postCreateNewBook = (req, res) => {
	let book = {
		Title     : req.body.title,
		Author    : req.body.author,
		Type      : req.body.type,
		ISBN      : req.body.isbn,
		dateAdded : new Date()
	}

	db.couchDB.insert(book, (err, book) => {
		if(err){
			return res.status(500).json({
				success: false, 
				message: 'Something went wrong.'
			});
		}

		res.status(200).json({
			success   : true, 
			message   : 'Successfully added a new book',
			"Details" : book
		});
	});
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HTTP put for updating an existing book
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.putUpdateExistingBook = (req, res) => {
	async.waterfall([
		(callback) => {
			db.couchDB.get(req.params.bookID, (err, book) => {
				if(!book){
					return res.status(404).json({ 
						sucess  : false, 
						error   : 'Error searching the book', 
						message : 'The Book you are looking for does not exist.'
					});
				}
				console.log(book)
				callback(err, book);
			});
		}, (book, callback) => {
			let changes = {
				Title     : req.body.title,
				Author    : req.body.author,
				Type      : req.body.type,
				ISBN      : req.body.isbn,
				_rev      : book._rev,
				dateUpdated : new Date()
			}

			db.couchDB.insert(changes, book._id, function (err, book) {
                callback(err, book);
            })

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
			db.couchDB.get(req.params.bookID, (err, book) => {
				if(!book){
					return res.status(404).json({ 
						sucess  : false, 
						error   : 'Error searching the book', 
						message : 'The Book you are looking for does not exist.'
					});
				}
				callback(err, book);
			});
		}, (book, callback) => {
			db.couchDB.destroy(book._id, book._rev, function (err, book) {
                callback(err, book);
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