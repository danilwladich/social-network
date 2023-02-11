import { AxiosError } from "axios";
import { Dispatch } from "react";
import { API } from "../API/API";
import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { setErrorMessage } from "./appReducer";
import { FriendsUserData } from "../models/Friends/FriendsUserData";
import { IFriends } from "./../models/Friends/IFriends";
import { WhoseFriends } from "../models/Friends/WhoseFriends";
import { IState } from "./../models/IState";

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

export function friendsReducer(
	state: IFriends = initialState,
	action: IAction
) {
	switch (action.type) {
		case ActionType.SET_WHOSE_FRIENDS:
			return {
				...state,
				whoseFriends: action.value,
			};

		case ActionType.SET_FRIENDS:
			return {
				...state,
				usersData:
					action.page === 1
						? [...action.value]
						: [...state.usersData, ...action.value],
			};

		case ActionType.SET_FRIENDS_TOTAL_COUNT:
			return {
				...state,
				totalCount: action.value,
			};

		case ActionType.FOLLOW:
			return {
				...state,
				usersData: state.usersData.map((u) => {
					if (u.nickname === action.value) {
						return { ...u, followed: true };
					}
					return u;
				}),
			};

		case ActionType.UNFOLLOW:
			return {
				...state,
				usersData: state.usersData.map((u) => {
					if (u.nickname === action.value) {
						return { ...u, followed: false };
					}
					return u;
				}),
			};

		default:
			return state;
	}
}

// action
export const setWhoseFriends: (whoseFriends: WhoseFriends) => IAction = (
	whoseFriends
) => ({
	type: ActionType.SET_WHOSE_FRIENDS,
	value: whoseFriends,
});

export const setFriends: (
	usersData: FriendsUserData[],
	page: number
) => IAction = (usersData, page) => ({
	type: ActionType.SET_FRIENDS,
	value: usersData,
	page,
});

export const setFriendsTotalCount: (count: number) => IAction = (count) => ({
	type: ActionType.SET_FRIENDS_TOTAL_COUNT,
	value: count,
});

// thunk
export const getFriendsTC = (
	userNickname: string,
	category: string,
	page: number,
	pageSize: number,
	search?: string
) => {
	return async (dispatch: Dispatch<IAction>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			const lastUserNickname =
				page > 1
					? getState().friends.usersData[
							getState().friends.usersData.length - 1
					  ].nickname
					: null;

			await API.getFriends(
				userNickname,
				category,
				page,
				pageSize,
				lastUserNickname,
				search
			).then((data) => {
				if (data.success === true) {
					if (page === 1) {
						dispatch(setWhoseFriends(data.whoseFriends));
					}
					dispatch(setFriends(data.usersData, page));
					dispatch(setFriendsTotalCount(data.totalCount));
				} else {
					dispatch(
						setWhoseFriends({
							nickname: "",
							firstName: "",
							lastName: "",
							image: "",
						})
					);
					dispatch(setFriends([], 1));
					dispatch(setFriendsTotalCount(0));
					dispatch(setErrorMessage("Get friends: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get friends: " + error.message));
		}
	};
};
