import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProfile } from "../../models/Profile/IProfile";
import { ProfileUserData } from "../../models/Profile/ProfileUserData";
import { ProfileFollowData } from "../../models/Profile/ProfileFollowData";
import { ProfilePostData } from "../../models/Profile/ProfilePostData";
import { setErrorMessage } from "./appReducer";
import { API } from "../../API/API";
import { AxiosError } from "axios";
import { authMeTC } from "./authReducer";
import { ServerResponse } from "../../models/ServerResponse";
import { IState } from "../store";
import { setAuthProfile } from "./authReducer";

const initialState: IProfile = {
	userData: {
		nickname: "",
		firstName: "",
		lastName: "",
		image: "",
		cover: "",
		location: {
			country: "",
			city: "",
		},
		online: false,
	},
	followData: {
		friends: {
			usersData: [],
			totalCount: 0,
		},
		followers: 0,
		following: 0,
	},
	postsData: [],
	pageSize: 20,
	totalCount: 0,
};

// slice
const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		setProfile(
			state,
			action: PayloadAction<{
				userData: ProfileUserData;
				followData: ProfileFollowData;
			}>
		) {
			state.userData = action.payload.userData;
			state.followData = action.payload.followData;
		},
		setPosts(
			state,
			action: PayloadAction<{
				postsData: ProfilePostData[];
				page: number;
			}>
		) {
			if (action.payload.page === 1) {
				state.postsData = action.payload.postsData;
			} else {
				state.postsData.push(...action.payload.postsData);
			}
		},
		setPostsTotalCount(state, action: PayloadAction<number>) {
			state.totalCount = action.payload;
		},
		addPost(
			state,
			action: PayloadAction<{
				post?: string;
				uploadedImages?: string[];
				id: string;
			}>
		) {
			const newPost: ProfilePostData = {
				id: action.payload.id,
				date: Date.now(),
				post: action.payload.post,
				images: action.payload.uploadedImages,
				likes: 0,
				likedMe: false,
			};
			state.postsData.unshift(newPost);
		},
		deletePost(state, action: PayloadAction<string>) {
			state.postsData = state.postsData.filter(
				(post) => post.id !== action.payload
			);
			state.totalCount--;
		},
		likePost(state, action: PayloadAction<string>) {
			state.postsData = state.postsData.map((post) => {
				if (post.id === action.payload) {
					return { ...post, likes: ++post.likes, likedMe: true };
				}
				return post;
			});
		},
		unlikePost(state, action: PayloadAction<string>) {
			state.postsData = state.postsData.map((post) => {
				if (post.id === action.payload) {
					return { ...post, likes: --post.likes, likedMe: false };
				}
				return post;
			});
		},
		setFollow(
			state,
			action: PayloadAction<{
				authNickname: string;
				authUser: {
					firstName: string;
					lastName: string;
					image?: string;
				};
			}>
		) {
			state.userData.followed = true;

			if (state.userData.follower) {
				if (state.followData.friends.usersData.length <= 9) {
					state.followData.friends.usersData =
						state.followData.friends.usersData.concat({
							nickname: action.payload.authNickname,
							...action.payload.authUser,
							online: true,
						});
				}

				state.followData.friends.totalCount++;
				state.followData.following--;
			} else {
				state.followData.followers++;
			}
		},
		setUnfollow(state, action: PayloadAction<string>) {
			state.userData.followed = false;

			if (state.userData.follower) {
				state.followData.friends.usersData =
					state.followData.friends.usersData.filter(
						(u) => u.nickname !== action.payload
					);

				state.followData.friends.totalCount--;
				state.followData.following++;
			} else {
				state.followData.followers--;
			}
		},
	},
});

// thunks
export const fetchProfileTC = createAsyncThunk<void, string, { state: IState }>(
	"profile/fetchProfileTC",
	async (userNickname, { dispatch, getState, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.getProfile(userNickname)) as ServerResponse<{
				userData: ProfileUserData;
				followData: ProfileFollowData;
			}>;
			const items = data.items;

			if (data.success === true) {
				dispatch(
					setProfile({ userData: items.userData, followData: items.followData })
				);

				if (items.userData.nickname === getState().auth.user.nickname) {
					const { firstName, lastName, image } = items.userData;
					dispatch(setAuthProfile({ firstName, lastName, image }));
				}

				await dispatch(
					fetchPostsTC({
						userNickname,
						page: 1,
						pageSize: getState().profile.pageSize,
					})
				);
			} else {
				dispatch(
					setProfile({
						userData: initialState.userData,
						followData: initialState.followData,
					})
				);
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get profile: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const fetchPostsTC = createAsyncThunk<
	void,
	{ userNickname: string; page: number; pageSize: number },
	{ state: IState }
>(
	"profile/fetchPostsTC",
	async (
		{ userNickname, page, pageSize },
		{ dispatch, getState, rejectWithValue }
	) => {
		dispatch(setErrorMessage(""));
		try {
			let lastPostID: string | null = null;
			if (page > 1) {
				lastPostID =
					getState().profile.postsData[getState().profile.postsData.length - 1]
						.id;
			}

			const data = (await API.getPosts(
				userNickname,
				page,
				pageSize,
				lastPostID
			)) as ServerResponse<{
				postsData: ProfilePostData[];
				totalCount: number;
			}>;
			const items = data.items;

			if (data.success === true) {
				dispatch(setPosts({ postsData: items.postsData, page: page }));
				if (page === 1) {
					dispatch(setPostsTotalCount(items.totalCount));
				}
			} else {
				dispatch(setPosts({ postsData: [], page: 1 }));
				dispatch(setPostsTotalCount(0));
				dispatch(setErrorMessage("Get posts: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get posts: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const addPostTC = createAsyncThunk<
	void,
	{
		post?: string;
		images?: FileList;
		uploadedImages?: string[];
	}
>(
	"profile/addPostTC",
	async ({ post, images, uploadedImages }, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.addPost(post, images)) as ServerResponse<{
				postID: string;
			}>;
			const items = data.items;

			if (data.success === true) {
				dispatch(addPost({ post, uploadedImages, id: items.postID }));
			} else {
				dispatch(setErrorMessage("Add post: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Add post: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const deletePostTC = createAsyncThunk<void, string>(
	"profile/deletePostTC",
	async (postID, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.deletePost(postID)) as ServerResponse;

			if (data.success === true) {
				dispatch(deletePost(postID));
			} else {
				dispatch(setErrorMessage("Delete post: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Delete post: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const likePostTC = createAsyncThunk<void, string>(
	"profile/likePostTC",
	async (postID, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.likePost(postID)) as ServerResponse;

			if (data.success === true) {
				dispatch(likePost(postID));
			} else {
				dispatch(setErrorMessage("Like post: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Like post: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const unlikePostTC = createAsyncThunk<void, string>(
	"profile/unlikePostTC",
	async (postID, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.unlikePost(postID)) as ServerResponse;

			if (data.success === true) {
				dispatch(unlikePost(postID));
			} else {
				dispatch(setErrorMessage("Unlike post: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Unlike post: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const setFollowTC = createAsyncThunk<void, string, { state: IState }>(
	"profile/setFollowTC",
	async (nickname, { dispatch, getState, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.followUser(nickname)) as ServerResponse;

			if (data.success === true) {
				dispatch(
					setFollow({
						authNickname: getState().auth.user.nickname,
						authUser: getState().auth.authProfile,
					})
				);
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

export const setUnfollowTC = createAsyncThunk<void, string, { state: IState }>(
	"profile/setUnfollowTC",
	async (nickname, { dispatch, getState, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.unfollowUser(nickname)) as ServerResponse;

			if (data.success === true) {
				dispatch(setUnfollow(getState().auth.user.nickname));
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

export const editProfileTC = createAsyncThunk<
	void,
	{
		nickname?: string;
		country?: string;
		city?: string;
	},
	{ state: IState }
>(
	"profile/editProfileTC",
	async (
		{ nickname, country, city },
		{ dispatch, getState, rejectWithValue }
	) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.editProfile(
				nickname,
				country,
				city
			)) as ServerResponse;

			if (data.success === true) {
				if (!!nickname) {
					await dispatch(authMeTC());
				} else {
					await dispatch(fetchProfileTC(getState().auth.user.nickname));
				}
			} else {
				return rejectWithValue(data.statusText);
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Edit profile: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const editProfileImageTC = createAsyncThunk<
	void,
	File,
	{ state: IState }
>(
	"profile/editProfileTC",
	async (image, { dispatch, getState, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.editProfileImage(image)) as ServerResponse;

			if (data.success === true) {
				await dispatch(fetchProfileTC(getState().auth.user.nickname));
			} else {
				return rejectWithValue(data.statusText);
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Edit profile image: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const editProfileCoverTC = createAsyncThunk<
	void,
	File,
	{ state: IState }
>(
	"profile/editProfileTC",
	async (cover, { dispatch, getState, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.editProfileCover(cover)) as ServerResponse;

			if (data.success === true) {
				await dispatch(fetchProfileTC(getState().auth.user.nickname));
			} else {
				return rejectWithValue(data.statusText);
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Edit profile cover: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const {
	setProfile,
	setPosts,
	setPostsTotalCount,
	addPost,
	deletePost,
	likePost,
	unlikePost,
	setFollow,
	setUnfollow,
} = profileSlice.actions;

export default profileSlice.reducer;
