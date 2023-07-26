import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IImages } from "../../models/IImages";

const initialState: IImages = {
	images: [],
	current: 0,
};

// slice
const imagesSlice = createSlice({
	name: "images",
	initialState,
	reducers: {
		setImages: (
			state,
			action: PayloadAction<{
				images: string[];
				current?: number;
			}>
		) => {
			state.images = action.payload.images;
			state.current = action.payload.current || 0;
		},
	},
});

export const { setImages } = imagesSlice.actions;

export default imagesSlice.reducer;
