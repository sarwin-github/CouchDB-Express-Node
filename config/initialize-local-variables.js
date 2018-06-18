module.exports.initializeVariable = (req, res, next) => {
  	res.locals.session = req.session;
  	res.locals.title   = "Website Title";
	res.locals.node_environment   = process.env.NODE_EN;

	next();
};