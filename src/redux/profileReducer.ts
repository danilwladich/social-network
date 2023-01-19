import { AxiosError } from "axios";
import { Dispatch } from "react";
import { API } from "../API/API";
import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { IProfile } from "../models/Profile/IProfile";
import { setErrorMessage } from "./appReducer";
import { IState } from "../models/IState";
import { setHeaderImage } from "./headerReducer";
import { ProfilePostData } from "../models/Profile/ProfilePostData";
import { ProfileUserData } from "../models/Profile/ProfileUserData";
import { ProfileAboutData } from "../models/Profile/ProfileAboutData";

const initialState: IProfile = {
	userData: {
		id: "",
		firstName: "",
		lastName: "",
		image: "",
	},
	aboutData: {
		friends: 0,
		follow: {
			followers: 0,
			followed: 0,
		},
		location: {
			country: "",
			city: "",
		},
	},
	postsData: [],
	pageSize: 20,
	totalCount: 0,
};

export function profileReducer(
	state: IProfile = initialState,
	action: IAction
) {
	switch (action.type) {
		case ActionType.SET_PROFILE:
			return {
				...state,
				userData: action.userData,
				aboutData: action.aboutData,
			};

		case ActionType.SET_POSTS:
			return {
				...state,
				postsData:
					action.page === 1
						? [...action.value]
						: [...state.postsData, ...action.value],
			};

		case ActionType.SET_POSTS_TOTAL_COUNT:
			return {
				...state,
				totalCount: action.value,
			};

		case ActionType.ADD_POST:
			const newPost = {
				id: state.postsData.length
					? state.postsData[state.postsData.length - 1].id + 1
					: 1,
				date: new Date().toString().split(" ").slice(1, 5).join(" "),
				post: action.value,
				likes: 0,
			};
			return {
				...state,
				postsData: [...state.postsData, newPost],
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

		case ActionType.FOLLOW:
			return {
				...state,
				userData: { ...state.userData, followed: true },
				aboutData: state.userData.follower
					? {
							...state.aboutData,
							friends: state.aboutData.friends + 1,
							follow: {
								...state.aboutData.follow,
								followed: state.aboutData.follow.followed - 1,
							},
					  }
					: {
							...state.aboutData,
							follow: {
								...state.aboutData.follow,
								followers: state.aboutData.follow.followers + 1,
							},
					  },
			};

		case ActionType.UNFOLLOW:
			return {
				...state,
				userData: { ...state.userData, followed: false },
				aboutData: state.userData.follower
					? {
							...state.aboutData,
							friends: state.aboutData.friends - 1,
							follow: {
								...state.aboutData.follow,
								followed: state.aboutData.follow.followed + 1,
							},
					  }
					: {
							...state.aboutData,
							follow: {
								...state.aboutData.follow,
								followers: state.aboutData.follow.followers - 1,
							},
					  },
			};

		default:
			return state;
	}
}

// action
export const setProfile: (
	userData: ProfileUserData,
	aboutData: ProfileAboutData
) => IAction = (userData, aboutData) => ({
	type: ActionType.SET_PROFILE,
	userData,
	aboutData,
});

export const setPosts: (
	postsData: ProfilePostData[],
	page: number
) => IAction = (postsData, page) => ({
	type: ActionType.SET_POSTS,
	value: postsData,
	page,
});

export const setPostsTotalCount: (count: number) => IAction = (count) => ({
	type: ActionType.SET_POSTS_TOTAL_COUNT,
	value: count,
});

export const addPost: (v: string) => IAction = (v) => ({
	type: ActionType.ADD_POST,
	value: v,
});

export const likePost: (id: number) => IAction = (id) => ({
	type: ActionType.LIKE_POST,
	value: id,
});

export const unlikePost: (id: number) => IAction = (id) => ({
	type: ActionType.UNLIKE_POST,
	value: id,
});

// thunk
export const getProfileTC = (userID: string) => {
	return async (dispatch: Dispatch<any>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			await API.getProfile(userID).then((data) => {
				if (data.success === true) {
					dispatch(setProfile(data.userData, data.aboutData));
					if (data.userData.id === getState().auth.user.id) {
						if (data.userData.image) {
							dispatch(setHeaderImage(data.userData.image));
						} else {
							dispatch(setHeaderImage(""));
						}
					}
					dispatch(getPostsTC(userID, 1, getState().profile.pageSize));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get profile: " + error.message));
		}
	};
};

export const getPostsTC = (userID: string, page: number, pageSize: number) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.getPosts(userID, page, pageSize).then((data) => {
				if (data.success === true) {
					dispatch(setPosts(data.postsData, page));
					dispatch(setPostsTotalCount(data.totalCount));
				} else {
					dispatch(setErrorMessage("Get posts: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get posts: " + error.message));
		}
	};
};

export const addPostTC = (post: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.addPost(post).then((data) => {
				if (data.success === true) {
					dispatch(addPost(post));
				} else {
					dispatch(setErrorMessage("Add post: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Add post: " + error.message));
		}
	};
};

export const likePostTC = (userID: string, postID: number) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.likePost(userID, postID).then((data) => {
				if (data.success === true) {
					dispatch(likePost(postID));
				} else {
					dispatch(setErrorMessage("Like post: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Like post: " + error.message));
		}
	};
};

export const unlikePostTC = (userID: string, postID: number) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.unlikePost(userID, postID).then((data) => {
				if (data.success === true) {
					dispatch(unlikePost(postID));
				} else {
					dispatch(setErrorMessage("Unlike post: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Unlike post: " + error.message));
		}
	};
};

export const editProfileTC = (
	image?: File,
	id?: string,
	country?: string,
	city?: string
) => {
	return async (dispatch: Dispatch<any>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			await API.editProfile(image, id, country, city).then((data) => {
				if (data.success === true) {
					dispatch(getProfileTC(getState().auth.user.id));
				} else {
					return Promise.reject(data.statusText);
				}
			});
		} catch (e: unknown) {
			if (typeof e === "string") {
				return Promise.reject(e);
			}
			const error = e as AxiosError;
			dispatch(setErrorMessage("Edit profile: " + error.message));
			return Promise.reject();
		}
	};
};
