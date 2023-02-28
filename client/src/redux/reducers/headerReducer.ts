import { IHeader } from "../../models/IHeader";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: IHeader = {
	burger: false,
};

// slice
export const headerSlice = createSlice({
	name: "header",
	initialState,
	reducers: {
		setBurger: (state, action: PayloadAction<boolean>) => {
			const body = document.querySelector("body");
			if (action.payload) {
				body?.classList.add("lock");
			} else {
				body?.classList.remove("lock");
			}

			state.burger = action.payload;
		},
	},
});

export const { setBurger } = headerSlice.actions;

export default headerSlice.reducer;
