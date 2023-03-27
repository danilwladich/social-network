import { Schema, model, Types } from "mongoose";

const schema = new Schema({
	date: { type: String, required: true },
	post: { type: String },
	images: { type: Array },
	likes: { type: Array },
	owner: { type: Types.ObjectId, ref: "User", required: true },
});

export default model("Post", schema);
