import { AxiosError } from "axios";
import { ISettings } from "../../models/Settings/ISettings";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { DonationData } from "../../models/Settings/DonationData";
import { setErrorMessage } from "./appReducer";
import { API } from "../../API/API";
import { ServerResponse } from "./../../models/ServerResponse";

const initialState: ISettings = {
	bodyTheme:
		localStorage.getItem("theme") ||
		(window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light"),
	donationsData: [],
};

// slice
const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		setTheme: (state, action: PayloadAction<string>) => {
			document.documentElement.setAttribute("theme", action.payload);
			localStorage.setItem("theme", action.payload);

			state.bodyTheme = action.payload;
		},
		setDonations: (state, action: PayloadAction<DonationData[]>) => {
			state.donationsData = action.payload;
		},
	},
});

// thunks
export const fetchDonationsTC = createAsyncThunk(
	"settings/getDonationsTC",
	async (_, { dispatch }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.getDonations()) as ServerResponse<{
				donationsData: DonationData[];
			}>;
			const items = data.items;

			if (data.success === true) {
				dispatch(setDonations(items.donationsData));
			} else {
				dispatch(setErrorMessage("Get donations: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get donations: " + error.message));
		}
	}
);

export const newDonationTC = createAsyncThunk<void, number>(
	"settings/newDonationTC",
	async (value, { dispatch }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.newDonation(value)) as ServerResponse;

			if (data.success === true) {
				await dispatch(fetchDonationsTC());
			} else {
				dispatch(setErrorMessage("New donation: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("New donation: " + error.message));
		}
	}
);

export const { setTheme, setDonations } = settingsSlice.actions;

export default settingsSlice.reducer;
