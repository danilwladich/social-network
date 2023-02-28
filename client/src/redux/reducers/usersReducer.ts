import { AxiosError } from "axios";
import { IUsers } from "../../models/Users/IUsers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { UsersUserData } from "../../models/Users/UsersUserData";
import { IState } from "../store";
import { setErrorMessage } from "./appReducer";
import { API } from "../../API/API";
import { ServerResponse } from "./../../models/ServerResponse";

const initialState: IUsers = {
	usersData: [],
	pageSize: 20,
	totalCount: 0,
};

// slice
const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		setUsers: (
			state,
			action: PayloadAction<{ usersData: UsersUserData[]; page: number }>
		) => {
			if (action.payload.page === 1) {
				state.usersData = action.payload.usersData;
			} else {
				state.usersData.push(...action.payload.usersData);
			}
		},
		setUsersTotalCount: (state, action: PayloadAction<number>) => {
			state.totalCount = action.payload;
		},
		setFollow: (state, action: PayloadAction<string>) => {
			state.usersData = state.usersData.map((user) => {
				if (user.nickname === action.payload) {
					return { ...user, followed: true };
				}
				return user;
			});
		},
		setUnfollow: (state, action: PayloadAction<string>) => {
			state.usersData = state.usersData.map((user) => {
				if (user.nickname === action.payload) {
					return { ...user, followed: false };
				}
				return user;
			});
		},
	},
});

// thunks
export const fetchUsersTC = createAsyncThunk<
	void,
	{ page: number; pageSize: number; search?: string },
	{ state: IState }
>(
	"users/fetchUsersTC",
	async (
		{ page, pageSize, search },
		{ dispatch, getState, rejectWithValue }
	) => {
		dispatch(setErrorMessage(""));
		try {
			let lastUserNickname: string | null = null;
			if (page > 1) {
				lastUserNickname =
					getState().users.usersData[getState().users.usersData.length - 1]
						.nickname;
			}

			const data = (await API.getUsers(
				page,
				pageSize,
				lastUserNickname,
				search
			)) as ServerResponse<{ usersData: UsersUserData[]; totalCount: number }>;
			const items = data.items;

			if (data.success === true) {
				dispatch(setUsers({ usersData: items.usersData, page }));
				dispatch(setUsersTotalCount(items.totalCount));
			} else {
				dispatch(setUsers({ usersData: [], page: 1 }));
				dispatch(setUsersTotalCount(0));
				dispatch(setErrorMessage("Get users: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get users: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const setFollowTC = createAsyncThunk<void, string, { state: IState }>(
	"users/setFollowTC",
	async (nickname, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.followUser(nickname)) as ServerResponse;

			if (data.success === true) {
				dispatch(setFollow(nickname));
			} else {
				dispatch(setErrorMessage("Follow: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Follow: " + error.message));
			return rejectWithValue(error.message)
		}
	}
);

export const setUnfollowTC = createAsyncThunk<void, string, { state: IState }>(
	"users/setUnfollowTC",
	async (nickname, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.unfollowUser(nickname)) as ServerResponse;

			if (data.success === true) {
				dispatch(setUnfollow(nickname));
			} else {
				dispatch(setErrorMessage("Unfollow: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Unfollow: " + error.message));
			return rejectWithValue(error.message)
		}
	}
);

export const { setUsers, setUsersTotalCount, setFollow, setUnfollow } =
	usersSlice.actions;

export default usersSlice.reducer;
