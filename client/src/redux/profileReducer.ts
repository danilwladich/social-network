import { AxiosError } from "axios";
import { Dispatch } from "react";
import { API } from "../API/API";
import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { IProfile } from "../models/Profile/IProfile";
import { setAuthProfile, setErrorMessage } from "./appReducer";
import { IState } from "../models/IState";
import { ProfilePostData } from "../models/Profile/ProfilePostData";
import { ProfileUserData } from "../models/Profile/ProfileUserData";
import { ProfileFollowData } from "../models/Profile/ProfileFollowData";
import { authMeTC } from "./authReducer";

const initialState: IProfile = {
	userData: {
		nickname: "",
		firstName: "",
		lastName: "",
		image: "",
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

export function profileReducer(
	state: IProfile = initialState,
	action: IAction
) {
	switch (action.type) {
		case ActionType.SET_PROFILE:
			return {
				...state,
				userData: action.userData,
				followData: action.followData,
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
				id: action.id,
				date: new Date().toString().split(" ").slice(1, 5).join(" "),
				post: action.value,
				likes: 0,
			};
			return {
				...state,
				postsData: [newPost, ...state.postsData],
			};

		case ActionType.DELETE_POST:
			return {
				...state,
				postsData: state.postsData.filter((p) => p.id !== action.value),
				totalCount: state.totalCount - 1,
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

		case ActionType.PROFILEPAGE_FOLLOW:
			if (state.userData.follower) {
				return {
					...state,

					userData: { ...state.userData, followed: true },

					followData: {
						...state.followData,

						friends: {
							...state.followData.friends,

							// add auth user if users count <= 9
							usersData:
								state.followData.friends.usersData.length <= 9
									? state.followData.friends.usersData.concat({
											nickname: action.authNickname,
											...action.authUser,
											online: true,
									  })
									: [...state.followData.friends.usersData],

							totalCount: state.followData.friends.totalCount + 1,
						},

						following: state.followData.following - 1,
					},
				};
			} else {
				return {
					...state,

					userData: { ...state.userData, followed: true },

					followData: {
						...state.followData,

						followers: state.followData.followers + 1,
					},
				};
			}

		case ActionType.PROFILEPAGE_UNFOLLOW:
			if (state.userData.follower) {
				return {
					...state,

					userData: { ...state.userData, followed: false },

					followData: {
						...state.followData,

						friends: {
							...state.followData.friends,

							usersData: state.followData.friends.usersData.filter(
								(u) => u.nickname !== action.authNickname
							),

							totalCount: state.followData.friends.totalCount - 1,
						},

						following: state.followData.following + 1,
					},
				};
			} else {
				return {
					...state,

					userData: { ...state.userData, followed: false },

					followData: {
						...state.followData,

						followers: state.followData.followers - 1,
					},
				};
			}

		default:
			return state;
	}
}

// action
export const setProfile: (
	userData: ProfileUserData,
	followData: ProfileFollowData
) => IAction = (userData, followData) => ({
	type: ActionType.SET_PROFILE,
	userData,
	followData,
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

export const addPost: (post: string, id: string) => IAction = (post, id) => ({
	type: ActionType.ADD_POST,
	value: post,
	id,
});

export const deletePost: (postID: string) => IAction = (postID) => ({
	type: ActionType.DELETE_POST,
	value: postID,
});

export const likePost: (postID: string) => IAction = (postID) => ({
	type: ActionType.LIKE_POST,
	value: postID,
});

export const unlikePost: (postID: string) => IAction = (postID) => ({
	type: ActionType.UNLIKE_POST,
	value: postID,
});

export const setFollow: (
	authNickname: string,
	authUser: {
		firstName: string;
		lastName: string;
		image?: string;
	}
) => IAction = (authNickname, authUser) => ({
	type: ActionType.PROFILEPAGE_FOLLOW,
	authNickname,
	authUser,
});

export const setUnfollow: (
	authNickname: string,
	authUser: {
		firstName: string;
		lastName: string;
		image?: string;
	}
) => IAction = (authNickname, authUser) => ({
	type: ActionType.PROFILEPAGE_UNFOLLOW,
	authNickname,
	authUser,
});

// thunk
export const getProfileTC = (userNickname: string) => {
	return async (dispatch: Dispatch<any>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			await API.getProfile(userNickname).then(async (data) => {
				if (data.success === true) {
					dispatch(setProfile(data.userData, data.followData));

					if (data.userData.nickname === getState().auth.user.nickname) {
						const { firstName, lastName, image } = data.userData;
						dispatch(setAuthProfile({ firstName, lastName, image }));
					}

					await dispatch(
						getPostsTC(userNickname, 1, getState().profile.pageSize)
					);
				} else {
					dispatch(
						setProfile(
							{
								nickname: "",
								firstName: "",
								lastName: "",
								image: "",
								location: {
									country: "",
									city: "",
								},
								online: false,
							},
							{
								friends: {
									usersData: [],
									totalCount: 0,
								},
								followers: 0,
								following: 0,
							}
						)
					);
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get profile: " + error.message));
		}
	};
};

export const getPostsTC = (
	userNickname: string,
	page: number,
	pageSize: number
) => {
	return async (dispatch: Dispatch<IAction>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			const lastPostID =
				page > 1
					? getState().profile.postsData[
							getState().profile.postsData.length - 1
					  ].id
					: null;

			await API.getPosts(userNickname, page, pageSize, lastPostID).then(
				(data) => {
					if (data.success === true) {
						dispatch(setPosts(data.postsData, page));
						if (page === 1) {
							dispatch(setPostsTotalCount(data.totalCount));
						}
					} else {
						dispatch(setPosts([], 1));
						dispatch(setPostsTotalCount(0));
						dispatch(setErrorMessage("Get posts: " + data.statusText));
					}
				}
			);
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
					dispatch(addPost(post, data.postID));
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

export const deletePostTC = (postID: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.deletePost(postID).then((data) => {
				if (data.success === true) {
					dispatch(deletePost(postID));
				} else {
					dispatch(setErrorMessage("Delete post: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Delete post: " + error.message));
		}
	};
};

export const likePostTC = (postID: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.likePost(postID).then((data) => {
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

export const unlikePostTC = (postID: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.unlikePost(postID).then((data) => {
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

export const setFollowTC = (nickname: string) => {
	return async (dispatch: Dispatch<IAction>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			await API.followUser(nickname).then((data) => {
				if (data.success === true) {
					dispatch(
						setFollow(getState().auth.user.nickname, getState().app.authProfile)
					);
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

export const setUnfollowTC = (nickname: string) => {
	return async (dispatch: Dispatch<IAction>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			await API.unfollowUser(nickname).then((data) => {
				if (data.success === true) {
					dispatch(
						setUnfollow(
							getState().auth.user.nickname,
							getState().app.authProfile
						)
					);
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

export const editProfileTC = (
	image?: File,
	nickname?: string,
	country?: string,
	city?: string
) => {
	return async (dispatch: Dispatch<any>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			await API.editProfile(image, nickname, country, city).then(
				async (data) => {
					if (data.success === true) {
						if (!!nickname) {
							await dispatch(authMeTC());
						} else {
							await dispatch(getProfileTC(getState().auth.user.nickname));
						}
					} else {
						return Promise.reject(data.statusText);
					}
				}
			);
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
