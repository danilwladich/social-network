import { AxiosError } from "axios";
import { Dispatch } from "react";
import { API } from "../API/API";
import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { IState } from "../models/IState";
import { IUsers } from "../models/Users/IUsers";
import { UsersUserData } from "../models/Users/UsersUserData";
import { setErrorMessage } from "./appReducer";

const initialState: IUsers = {
	usersData: [],
	pageSize: 20,
	totalCount: 0,
};

export function usersReducer(state: IUsers = initialState, action: IAction) {
	switch (action.type) {
		case ActionType.SET_USERS:
			return {
				...state,
				usersData:
					action.page === 1
						? [...action.value]
						: [...state.usersData, ...action.value],
			};

		case ActionType.SET_USERS_TOTAL_COUNT:
			return {
				...state,
				totalCount: action.value,
			};

		case ActionType.FOLLOW:
			return {
				...state,
				usersData: state.usersData.map((u) => {
					if (u.id === action.value) {
						return { ...u, followed: true };
					}
					return u;
				}),
			};

		case ActionType.UNFOLLOW:
			return {
				...state,
				usersData: state.usersData.map((u) => {
					if (u.id === action.value) {
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
export const setUsers: (usersData: UsersUserData[], page: number) => IAction = (
	usersData,
	page
) => ({
	type: ActionType.SET_USERS,
	value: usersData,
	page,
});

export const setUsersTotalCount: (count: number) => IAction = (count) => ({
	type: ActionType.SET_USERS_TOTAL_COUNT,
	value: count,
});

export const setFollow: (userID: string) => IAction = (userID) => ({
	type: ActionType.FOLLOW,
	value: userID,
});

export const setUnfollow: (userID: string) => IAction = (userID) => ({
	type: ActionType.UNFOLLOW,
	value: userID,
});

// thunk
export const getUsersTC = (page: number, pageSize: number, search?: string) => {
	return async (dispatch: Dispatch<IAction>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			const lastUserID =
				page > 1
					? getState().users.usersData[getState().users.usersData.length - 1].id
					: null;

			await API.getUsers(page, pageSize, lastUserID, search).then((data) => {
				if (data.success === true) {
					dispatch(setUsers(data.usersData, page));
					dispatch(setUsersTotalCount(data.totalCount));
				} else {
					dispatch(setUsers([], 1));
					dispatch(setUsersTotalCount(0));
					dispatch(setErrorMessage("Get users: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get users: " + error.message));
		}
	};
};

export const setFollowTC = (id: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.followUser(id).then((data) => {
				if (data.success === true) {
					dispatch(setFollow(id));
				} else {
					dispatch(setErrorMessage("Follow: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Follow: " + error.message));
		}
	};
};

export const setUnfollowTC = (id: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.unfollowUser(id).then((data) => {
				if (data.success === true) {
					dispatch(setUnfollow(id));
				} else {
					dispatch(setErrorMessage("Unfollow: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Unfollow: " + error.message));
		}
	};
};
