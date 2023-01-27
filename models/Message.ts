import { Schema, model, Types } from "mongoose";

const schema = new Schema({
	date: { type: String, required: true },
	message: { type: String, required: true },
	read: { type: Boolean, required: true, default: false },
	from: { type: Types.ObjectId, ref: "User" },
	to: { type: Types.ObjectId, ref: "User" },
});

export default model("Message", schema);
