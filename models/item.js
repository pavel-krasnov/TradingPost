const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Item", itemSchema);