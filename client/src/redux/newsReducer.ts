import { AxiosError } from "axios";
import { Dispatch } from "react";
import { API } from "../API/API";
import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { setErrorMessage } from "./appReducer";
import { IState } from "../models/IState";
import { INews } from "../models/News/INews";
import { NewsPostData } from "./../models/News/NewsPostData";

const initialState: INews = {
	postsData: [],
	pageSize: 20,
	totalCount: 0,
};

export function newsReducer(state: INews = initialState, action: IAction) {
	switch (action.type) {
		case ActionType.SET_NEWS:
			return {
				...state,
				postsData:
					action.page === 1
						? [...action.value]
						: [...state.postsData, ...action.value],
			};

		case ActionType.SET_NEWS_TOTAL_COUNT:
			return {
				...state,
				totalCount: action.value,
			};

		case ActionType.LIKE_POST:
			return {
				...state,
				postsData: state.postsData.map((p) => {
					if (p.id === action.value) {
						return { ...p, likes: p.likes + 1, likedMe: true };
					}
					return p;
				}),
			};

		case ActionType.UNLIKE_POST:
			return {
				...state,
				postsData: state.postsData.map((p) => {
					if (p.id === action.value) {
						return { ...p, likes: p.likes - 1, likedMe: false };
					}
					return p;
				}),
			};

		default:
			return state;
	}
}

// action
export const setNews: (postsData: NewsPostData[], page: number) => IAction = (
	postsData,
	page
) => ({
	type: ActionType.SET_NEWS,
	value: postsData,
	page,
});

export const setNewsTotalCount: (count: number) => IAction = (count) => ({
	type: ActionType.SET_NEWS_TOTAL_COUNT,
	value: count,
});

// thunk
export const getNewsTC = (page: number, pageSize: number) => {
	return async (dispatch: Dispatch<IAction>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			const lastPostID =
				page > 1
					? getState().news.postsData[getState().news.postsData.length - 1]
							.id
					: null;

			await API.getNews(page, pageSize, lastPostID).then((data) => {
				if (data.success === true) {
					dispatch(setNews(data.postsData, page));
					if (page === 1) {
						dispatch(setNewsTotalCount(data.totalCount));
					}
				} else {
					dispatch(setNews([], 1));
					dispatch(setNewsTotalCount(0));
					dispatch(setErrorMessage("Get news: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get news: " + error.message));
		}
	};
};
