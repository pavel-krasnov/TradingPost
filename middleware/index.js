const Item = require("../models/item");
const Comment = require("../models/comment");

const middlewareObject = {
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash("error", "You need to be logged in to do this!");
		res.redirect("/login");
	},

	checkItemOwnership: function(req, res, next) {
		if (req.isAuthenticated()) {
			Item.findById(req.params.id, (err, item) => {
				if (err || !item) {
					req.flash("error", "Item not found");
					res.redirect("back");
				} else {
					if (item.user.id.equals(req.user._id)) {
						next();
					} else {
						req.flash("error", "You don't have permission to do this");
						res.redirect("back");
					}
				}
			});
		} else {
			req.flash("error", "You need to be logged in to do this!");
			res.redirect("back");
		}
	},

	checkCommentOwnership: function(req, res, next) {
		if (req.isAuthenticated()) {
			Comment.findById(req.params.comment_id, (err, comment) => {
				if (err) {
					res.redirect("back");
				} else {
					if (comment.user.id.equals(req.user._id)) {
						next();
					} else {
						req.flash("error", "You don't have permission to do this");
						res.redirect("back");
					}
				}
			});
		} else {
			req.flash("error", "You need to be logged in to do this!");
			res.redirect("back");
		}
	}
};

module.exports = middlewareObject;