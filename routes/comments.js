const	express 	= require("express"),
		router		= express.Router({mergeParams: true}),
		Item		= require("../models/item"),
		Comment		= require("../models/comment"),
		middleware	= require("../middleware/index");

router.get("/new", middleware.isLoggedIn, (req, res) => {
	Item.findById(req.params.id, (err, item) => {
		if (err) {
			console.log(err);
		} else {
			res.render("./comment/new.ejs", {item: item});
		}
	});
});

router.post("/", middleware.isLoggedIn, (req, res) => {
	Comment.create({
		text: req.body.text,
		user: {
			id: req.user._id,
			username: req.user.username
		}
	}, (err, comment) => {
		if (err) {
			req.flash("error", "Something went wrong");
			console.log(err);
		} else {
			Item.findById(req.params.id, (err, item) => {
				if (err) {
					console.log(err);
					comment.remove();
				} else {
					item.comments.push(comment);
					item.save();
					console.log("Created new comment");
					req.flash("success", "Comment has been added");
					res.redirect("/items/" + req.params.id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, comment) => {
		if (err) {
			res.redirect("back");
		} else {
			res.render("./comment/edit.ejs", {comment: comment, item_id: req.params.id});
		}
	});
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/items/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/items/" + req.params.id);
		}
	});
});

module.exports = router;