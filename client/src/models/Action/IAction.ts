import { ActionType } from "./ActionType";
import { UsersUserData } from "../Users/UsersUserData";
import { IAuth } from "../IAuth";
import { ProfilePostData } from "../Profile/ProfilePostData";
import { ProfileFollowData } from "../Profile/ProfileFollowData";
import { ProfileUserData } from "../Profile/ProfileUserData";
import { FriendsUserData } from "../Friends/FriendsUserData";
import { WhoseFriends } from "../Friends/WhoseFriends";
import { MessagesUserData } from "../Messages/MessagesUserData";
import { ChatWith } from "../Messages/ChatWith";
import { MessagesMessageData } from "../Messages/MessagesMessageData";
import { NewsPostData } from "./../News/NewsPostData";
import { DonationData } from "./../Settings/DonationData";

// APP
interface setErrorMessage {
	type: ActionType.SET_ERROR_MESSAGE;
	value: string;
}
interface setAuthProfile {
	type: ActionType.SET_AUTH_PROFILE;
	value: {
		firstName: string;
		lastName: string;
		image?: string;
	};
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
	followData: ProfileFollowData;
}
interface addPost {
	type: ActionType.ADD_POST;
	value: string;
	id: string;
}
interface deletePost {
	type: ActionType.DELETE_POST;
	value: string;
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
interface profilePageFollowUser {
	type: ActionType.PROFILEPAGE_FOLLOW;
	authNickname: string;
	authUser: {
		firstName: string;
		lastName: string;
		image?: string;
	};
}
interface profilePageUnfollowUser {
	type: ActionType.PROFILEPAGE_UNFOLLOW;
	authNickname: string;
	authUser: {
		firstName: string;
		lastName: string;
		image?: string;
	};
}

// NEWS
interface setNews {
	type: ActionType.SET_NEWS;
	value: NewsPostData[];
	page: number;
}
interface setNewsTotalCount {
	type: ActionType.SET_NEWS_TOTAL_COUNT;
	value: number;
}

// MESSAGES
interface setChats {
	type: ActionType.SET_CHATS;
	value: MessagesUserData[];
}
interface setChatWith {
	type: ActionType.SET_CHAT_WITH;
	value: ChatWith;
}
interface setMessages {
	type: ActionType.SET_MESSAGES;
	messagesData: MessagesMessageData[];
	page: number;
}
interface setMessagesTotalCount {
	type: ActionType.SET_MESSAGES_TOTAL_COUNT;
	value: number;
}
interface deleteChat {
	type: ActionType.DELETE_CHAT;
	value: string;
}
interface sendMessage {
	type: ActionType.SEND_MESSAGE;
	value: string;
	id: string;
}
interface messageSent {
	type: ActionType.MESSAGE_SENT;
	oldID: string;
	newID: string;
}
interface receiveMessage {
	type: ActionType.RECEIVE_MESSAGE;
	messageData: MessagesMessageData;
	fromUser: MessagesUserData;
}
interface messagesRead {
	type: ActionType.MESSAGES_READ;
	value: string;
}
interface readMessages {
	type: ActionType.READ_MESSAGES;
	value: string;
}
interface setCountOfUnreadMessages {
	type: ActionType.SET_COUNT_OF_UNREAD_MESSAGES;
	value: string[];
}
interface deleteMessage {
	type: ActionType.DELETE_MESSAGE;
	messageID: string;
}
interface messageDelete {
	type: ActionType.MESSAGE_DELETE;
	fromUser: string;
	messageID: string;
	penultimateMessageData?: MessagesMessageData;
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
interface friendsPageFollowUser {
	type: ActionType.FRIENDSPAGE_FOLLOW;
	value: string;
}
interface friendsPageUnfollowUser {
	type: ActionType.FRIENDSPAGE_UNFOLLOW;
	value: string;
}

// USERS
interface setUsers {
	type: ActionType.SET_USERS;
	value: UsersUserData[];
	page: number;
}
interface setUsersTotalCount {
	type: ActionType.SET_USERS_TOTAL_COUNT;
	value: number;
}
interface usersPageFollowUser {
	type: ActionType.USERSPAGE_FOLLOW;
	value: string;
}
interface usersPageUnfollowUser {
	type: ActionType.USERSPAGE_UNFOLLOW;
	value: string;
}

// SETTINGS
interface setDonations {
	type: ActionType.SET_DONATIONS;
	value: DonationData[];
}

export type IAction =
	| setAuthUser
	| setAuthProfile
	| setCountOfUnreadMessages
	| setErrorMessage
	| notAuthUser
	| setTheme
	| setChats
	| sendMessage
	| addPost
	| messagesRead
	| messageSent
	| setWhoseFriends
	| setNews
	| setPosts
	| setPostsTotalCount
	| setNewsTotalCount
	| deletePost
	| deleteMessage
	| deleteChat
	| setUsers
	| setChatWith
	| setMessages
	| profilePageFollowUser
	| profilePageUnfollowUser
	| friendsPageFollowUser
	| friendsPageUnfollowUser
	| usersPageFollowUser
	| usersPageUnfollowUser
	| messageDelete
	| setMessagesTotalCount
	| receiveMessage
	| setFriends
	| setFriendsTotalCount
	| setUsersTotalCount
	| setProfile
	| likePost
	| unlikePost
	| readMessages
	| setDonations
	| setBurger
	| setHeaderImage;
