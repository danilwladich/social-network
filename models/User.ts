import { Schema, model, Types } from "mongoose";

const schema = new Schema({
	nickname: { type: String, required: true, unique: true },
	phoneNumber: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	avatar: { type: String },
	cover: { type: String },
	location: {
		country: { type: String },
		city: { type: String },
	},
	posts: [{ type: Types.ObjectId, ref: "Post" }],
	followers: { type: Array },
	following: { type: Array },
});

export default model("User", schema);
