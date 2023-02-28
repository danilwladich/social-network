import { AxiosError } from "axios";
import { IFriends } from "../../models/Friends/IFriends";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WhoseFriends } from "../../models/Friends/WhoseFriends";
import { FriendsUserData } from "../../models/Friends/FriendsUserData";
import { setErrorMessage } from "./appReducer";
import { API } from "../../API/API";
import { ServerResponse } from "./../../models/ServerResponse";
import { IState } from "../store";

const initialState: IFriends = {
	whoseFriends: {
		nickname: "",
		firstName: "",
		lastName: "",
		image: "",
	},
	usersData: [],
	pageSize: 20,
	totalCount: 0,
};

// slice
const friendsSlice = createSlice({
	name: "friends",
	initialState,
	reducers: {
		setWhoseFriends: (state, action: PayloadAction<WhoseFriends>) => {
			state.whoseFriends = action.payload;
		},
		setFriends: (
			state,
			action: PayloadAction<{
				usersData: FriendsUserData[];
				page: number;
			}>
		) => {
			if (action.payload.page === 1) {
				state.usersData = action.payload.usersData;
			} else {
				state.usersData.push(...action.payload.usersData);
			}
		},
		setFriendsTotalCount: (state, action: PayloadAction<number>) => {
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
export const fetchFriendsTC = createAsyncThunk<
	void,
	{
		userNickname: string;
		category: string;
		page: number;
		pageSize: number;
		search?: string;
	},
	{ state: IState }
>(
	"friends/fetchFriendsTC",
	async (
		{ userNickname, category, page, pageSize, search },
		{ dispatch, getState, rejectWithValue }
	) => {
		dispatch(setErrorMessage(""));
		try {
			let lastUserNickname: string | null = null;
			if (page > 1) {
				lastUserNickname =
					getState().friends.usersData[getState().friends.usersData.length - 1]
						.nickname;
			}

			const data = (await API.getFriends(
				userNickname,
				category,
				page,
				pageSize,
				lastUserNickname,
				search
			)) as ServerResponse<{
				whoseFriends: WhoseFriends;
				usersData: FriendsUserData[];
				totalCount: number;
			}>;
			const items = data.items;

			if (data.success === true) {
				if (page === 1) {
					dispatch(setWhoseFriends(items.whoseFriends));
				}
				dispatch(setFriends({ usersData: items.usersData, page }));
				dispatch(setFriendsTotalCount(items.totalCount));
			} else {
				dispatch(setWhoseFriends(initialState.whoseFriends));
				dispatch(setFriends({ usersData: [], page: 1 }));
				dispatch(setFriendsTotalCount(0));
				if (data.statusText !== "User not found") {
					dispatch(setErrorMessage("Get friends: " + data.statusText));
				}
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get friends: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const setFollowTC = createAsyncThunk<void, string>(
	"friends/setFollowTC",
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
			return rejectWithValue(error.message);
		}
	}
);

export const setUnfollowTC = createAsyncThunk<void, string>(
	"friends/setUnfollowTC",
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
			return rejectWithValue(error.message);
		}
	}
);

export const {
	setWhoseFriends,
	setFriends,
	setFriendsTotalCount,
	setFollow,
	setUnfollow,
} = friendsSlice.actions;

export default friendsSlice.reducer;
