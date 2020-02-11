const	express 	= require("express"),
		router		= express.Router(),
		User		= require("../models/user"),
		passport	= require("passport");

router.get("/", (req, res) => {
	res.render("landing.ejs");
});

router.get("/register", (req, res) => {
	res.render("register.ejs");
});

router.post("/register", (req, res) => {
	const 	newUser 	= new User({username: req.body.username}),
			password 	= req.body.password;
	User.register(newUser, password, (err, user) => {
		if (err) {
			req.flash("error", err.message);
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to Trading Post, " + user.username);
			res.redirect("/items");
		});
	});
});

router.get("/login", (req, res) => {
	res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/items",
	failureRedirect: "/login"
}), (req, res) => {
	
});

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You have logged out.");
	res.redirect("/items");
});

module.exports = router;