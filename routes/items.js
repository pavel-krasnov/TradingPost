const	express		= require("express"),
		router		= express.Router(),
		Item		= require("../models/item"),
		middleware	= require("../middleware/index");

router.get("/", (req, res) => {
	Item.find({}, (err, items) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Items got");
			res.render("./item/index.ejs", {items: items});
		}
	});
});

router.post("/", middleware.isLoggedIn, (req, res) => {
	const 	name			= req.body.name,
			price			= req.body.price,
			image			= req.body.image,
			description		= req.body.description,
			user			= req.user;
	Item.create({
		name: name,
		price: price,
		image: image,
		description: description,
		user: {
			id: user._id,
			username: user.username
		}
	}, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Item created");
		}
	});
	res.redirect("/items");
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("./item/new.ejs");
});


router.get("/:id", (req, res) => {
	Item.findById(req.params.id).populate("comments").exec((err, item) => {
		if (err || !item) {
			req.flash("error", "Item was not found");
			res.redirect("back");
			console.log(err);
		} else {
			res.render("./item/show.ejs", {item: item});
		}
	});
});

router.get("/:id/edit", middleware.checkItemOwnership, (req, res) => {
	Item.findById(req.params.id, (err, item) => {
		res.render("./item/edit.ejs", {item: item});
	});
});

router.put("/:id", middleware.checkItemOwnership, (req, res) => {
	Item.findByIdAndUpdate(req.params.id, req.body.item, (err, item) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/items/" + req.params.id);
		}
	});
});

router.delete("/:id", middleware.checkItemOwnership, (req, res) => {
	Item.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/items");
		}
	});
});

module.exports = router;