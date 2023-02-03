import { Schema, model, Types } from "mongoose";

const schema = new Schema({
	date: { type: String, required: true },
	post: { type: String, required: true },
	likes: { type: Array },
	owner: { type: Types.ObjectId, ref: "User" },
});

export default model("Post", schema);
