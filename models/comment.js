const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	text: String,
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Comment", commentSchema);