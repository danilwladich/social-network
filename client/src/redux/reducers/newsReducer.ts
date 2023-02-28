import { AxiosError } from "axios";
import { INews } from "../../models/News/INews";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { NewsPostData } from "../../models/News/NewsPostData";
import { setErrorMessage } from "./appReducer";
import { API } from "../../API/API";
import { ServerResponse } from "./../../models/ServerResponse";
import { IState } from "../store";

const initialState: INews = {
	postsData: [],
	pageSize: 20,
	totalCount: 0,
};

// slice
const newsSlice = createSlice({
	name: "news",
	initialState,
	reducers: {
		setNews: (
			state,
			action: PayloadAction<{ postsData: NewsPostData[]; page: number }>
		) => {
			if (action.payload.page === 1) {
				state.postsData = action.payload.postsData;
			} else {
				state.postsData.push(...action.payload.postsData);
			}
		},
		setNewsTotalCount: (state, action: PayloadAction<number>) => {
			state.totalCount = action.payload;
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
	},
});

// thunks
export const fetchNewsTC = createAsyncThunk<
	void,
	{ page: number; pageSize: number },
	{ state: IState }
>(
	"news/fetchNewsTC",
	async ({ page, pageSize }, { dispatch, getState, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			let lastPostID = null;
			if (page > 1) {
				lastPostID =
					getState().news.postsData[getState().news.postsData.length - 1].id;
			}

			const data = (await API.getNews(
				page,
				pageSize,
				lastPostID
			)) as ServerResponse<{ postsData: NewsPostData[]; totalCount: number }>;
			const items = data.items;

			if (data.success === true) {
				dispatch(setNews({ postsData: items.postsData, page }));
				if (page === 1) {
					dispatch(setNewsTotalCount(items.totalCount));
				}
			} else {
				dispatch(setNews({ postsData: [], page: 1 }));
				dispatch(setNewsTotalCount(0));
				dispatch(setErrorMessage("Get news: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get news: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const likePostTC = createAsyncThunk<void, string>(
	"news/likePostTC",
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
	"news/unlikePostTC",
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

export const { setNews, setNewsTotalCount, likePost, unlikePost } =
	newsSlice.actions;

export default newsSlice.reducer;
