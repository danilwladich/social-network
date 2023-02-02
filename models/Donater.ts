import { Schema, model, Types } from "mongoose";

const schema = new Schema({
	owner: { type: Types.ObjectId, ref: "User" },
	value: { type: Number, required: true },
});

export default model("Donater", schema);
