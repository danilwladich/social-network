import { AxiosError } from "axios";
import { IAuth } from "../../models/IAuth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { setErrorMessage } from "./appReducer";
import { API } from "../../API/API";
import { ServerResponse } from "./../../models/ServerResponse";
import { fetchCountOfUnreadMessagesTC } from "./messagesReducer";

const initialState: IAuth = {
	user: {
		nickname: "",
		token: "",
	},
	authProfile: JSON.parse(localStorage.getItem("authProfile") || "{}"),
	isAuth: false,
};

// slice
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuthUser: (
			state,
			action: PayloadAction<{
				nickname: string;
				token: string;
			}>
		) => {
			state.user = action.payload;
			state.isAuth = true;
		},
		setNotAuthUser: (state) => {
			state.user = initialState.user;
			state.isAuth = false;
		},
		setAuthProfile: (
			state,
			action: PayloadAction<{
				firstName: string;
				lastName: string;
				image?: string;
			}>
		) => {
			localStorage.setItem("authProfile", JSON.stringify(action.payload));
			state.authProfile = action.payload;
		},
	},
});

// thunks
export const authMeTC = createAsyncThunk(
	"auth/authMeTC",
	async (_, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.authMe()) as ServerResponse<{
				user: {
					nickname: string;
					token: string;
				};
			}>;
			const items = data.items;

			if (data.success === true) {
				dispatch(setAuthUser(items.user));
				await dispatch(fetchCountOfUnreadMessagesTC());
			} else {
				dispatch(setNotAuthUser());
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Auth: " + error.message));
			return rejectWithValue(error.message)
		}
	}
);

export const loginTC = createAsyncThunk<
	void,
	{ phoneNumber: string; password: string; recaptcha: string }
>(
	"auth/loginTC",
	async (
		{ phoneNumber, password, recaptcha },
		{ dispatch, rejectWithValue }
	) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.login(
				phoneNumber,
				password,
				recaptcha
			)) as ServerResponse;

			if (data.success === true) {
				await dispatch(authMeTC());
			} else {
				return rejectWithValue(data.statusText);
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Login: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const registerTC = createAsyncThunk<
	void,
	{
		phoneNumber: string;
		password: string;
		firstName: string;
		lastName: string;
		recaptcha: string;
	}
>(
	"auth/registerTC",
	async (
		{ phoneNumber, password, firstName, lastName, recaptcha },
		{ dispatch, rejectWithValue }
	) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.register(
				phoneNumber,
				password,
				firstName,
				lastName,
				recaptcha
			)) as ServerResponse;

			if (data.success === true) {
				await dispatch(authMeTC());
			} else {
				return rejectWithValue(data.statusText);
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Register: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const logoutTC = createAsyncThunk(
	"auth/logoutTC",
	async (_, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.logout()) as ServerResponse;

			if (data.success === true) {
				dispatch(setNotAuthUser());
			} else {
				dispatch(setErrorMessage("Logout: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Logout: " + error.message));
			return rejectWithValue(error.message)
		}
	}
);

export const deleteAccountTC = createAsyncThunk<void, string>(
	"auth/deleteAccountTC",
	async (password, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.deleteAccount(password)) as ServerResponse;

			if (data.success === true) {
				await dispatch(logoutTC());
			} else {
				return rejectWithValue(data.statusText);
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Delete account: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const { setAuthUser, setNotAuthUser, setAuthProfile } =
	authSlice.actions;

export default authSlice.reducer;
