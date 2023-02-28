import { AxiosError } from "axios";
import { IApp } from "../../models/IApp";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { authMeTC } from "./authReducer";

const initialState: IApp = {
	errorMessage: "",
};

// slice
const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setErrorMessage: (state, action: PayloadAction<string>) => {
			state.errorMessage = action.payload;
		},
	},
});

// thunks
export const setInitializationTC = createAsyncThunk(
	"app/setInitializationTC",
	async (_, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			await dispatch(authMeTC());
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Initialization: " + error.message));
			return rejectWithValue(error.message)
		}
	}
);

export const { setErrorMessage } = appSlice.actions;

export default appSlice.reducer;
