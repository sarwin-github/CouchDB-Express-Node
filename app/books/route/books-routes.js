const express   = require('express');
const router    = express();

const booksController = require('../controller/books-controller');

/* Get The list of books from books_library */
router.route('/').get(booksController.getAllBooks);
router.route('/list').get(booksController.getAllBooks);


// Get the list of books group by author
router.route('/author').get(booksController.getAllAuthors);

// Get single books detail
router.route('/details/:bookID').get(booksController.getSingleBook);

// Create new book
router.route('/create').get(booksController.getCreateNewBook);
router.route('/create').post(booksController.postCreateNewBook);
/*
router.route('/update/:bookID').put(booksController.putUpdateExistingBook);
router.route('/delete/:bookID').delete(booksController.deleteExistingBook);
*/
module.exports = router;
