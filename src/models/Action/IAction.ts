import { ActionType } from "./ActionType";
import { UsersUserData } from "../Users/UsersUserData";
import { IAuth } from "../IAuth";
import { ProfilePostData } from "../Profile/ProfilePostData";
import { ProfileAboutData } from "../Profile/ProfileAboutData";
import { ProfileUserData } from "../Profile/ProfileUserData";
import { FriendsUserData } from "../Friends/FriendsUserData";
import { WhoseFriends } from "../Friends/WhoseFriends";

// APP
interface setInitializationd {
	type: ActionType.SET_INITIALIZATION;
}
interface setErrorMessage {
	type: ActionType.SET_ERROR_MESSAGE;
	value: string;
}

// HEADER
interface setHeaderImage {
	type: ActionType.SET_HEADER_IMAGE;
	value: string;
}
interface setBurger {
	type: ActionType.SET_BURGER;
	value: boolean;
}

// AUTH & LOGIN
interface setAuthUser {
	type: ActionType.SET_AUTH_USER;
	value: IAuth;
}
interface notAuthUser {
	type: ActionType.NOT_AUTH_USER;
}

// SETTINGS
interface setTheme {
	type: ActionType.SET_THEME;
	value: string;
}

// PROFILE
interface setProfile {
	type: ActionType.SET_PROFILE;
	userData: ProfileUserData;
	aboutData: ProfileAboutData;
}
interface addPost {
	type: ActionType.ADD_POST;
	value: string;
	id: string;
}
interface setPosts {
	type: ActionType.SET_POSTS;
	value: ProfilePostData[];
	page: number;
}
interface setPostsTotalCount {
	type: ActionType.SET_POSTS_TOTAL_COUNT;
	value: number;
}
interface likePost {
	type: ActionType.LIKE_POST;
	value: string;
}
interface unlikePost {
	type: ActionType.UNLIKE_POST;
	value: string;
}

// USERS & PROFILE & FRIENDS
interface followUser {
	type: ActionType.FOLLOW;
	value: string;
}
interface unfollowUser {
	type: ActionType.UNFOLLOW;
	value: string;
}

// MESSAGES
interface sendMessage {
	type: ActionType.SEND_MESSAGE;
	value: string;
	id: number;
}

// FRIENDS
interface setWhoseFriends {
	type: ActionType.SET_WHOSE_FRIENDS;
	value: WhoseFriends;
}
interface setFriends {
	type: ActionType.SET_FRIENDS;
	value: FriendsUserData[];
	page: number;
}
interface setFriendsTotalCount {
	type: ActionType.SET_FRIENDS_TOTAL_COUNT;
	value: number;
}

// USERS
interface setUsers {
	type: ActionType.SET_USERS;
	value: UsersUserData[];
}
interface setUsersTotalCount {
	type: ActionType.SET_USERS_TOTAL_COUNT;
	value: number;
}

export type IAction =
	| setInitializationd
	| setAuthUser
	| setErrorMessage
	| notAuthUser
	| setTheme
	| sendMessage
	| addPost
	| followUser
	| setWhoseFriends
	| setPosts
	| setPostsTotalCount
	| unfollowUser
	| setUsers
	| setFriends
	| setFriendsTotalCount
	| setUsersTotalCount
	| setProfile
	| likePost
	| unlikePost
	| setBurger
	| setHeaderImage;
