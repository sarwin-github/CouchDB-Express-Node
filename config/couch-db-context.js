'use strict';

const session = require('express-session');
const db = {
	host: 'localhost:5984',
	username: process.env.CouchDBUser,
	password: process.env.CouchDBPassword,
	database: 'mylibrary'
}

module.exports.couchDB = require("nano")(`http://${db.username}:${db.password}@${db.host}`).use(`${db.database}`)

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Session storage and database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.setEnv = (env, app) => {
	app.set('port', process.env.PORT || 9001);

	// Set session and cookie max life, store session in mongo database
	app.use(session({
		secret : process.env.sessionKey,    
		httpOnly: true,
		resave : true,
	  	saveUninitialized: false, 
		cookie : { maxAge: 60 * 60 * 1000}
	}));
};

