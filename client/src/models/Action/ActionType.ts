export enum ActionType {
	// app
	SET_INITIALIZATION = "app/SET_INITIALIZATION",
	SET_ERROR_MESSAGE = "app/SET_ERROR_MESSAGE",

	// header
	SET_HEADER_IMAGE = "header/SET_HEADER_IMAGE",
	SET_BURGER = "header/SET_BURGER",

	// auth
	SET_AUTH_USER = "auth/SET_AUTH_USER",
	NOT_AUTH_USER = "auth/NOT_AUTH_USER",

	// profile
	SET_PROFILE = "profile/SET_PROFILE",
	ADD_POST = "profile/ADD_POST",
	DELTE_POST = "profile/DELTE_POST",
	SET_POSTS = "profile/SET_POSTS",
	SET_POSTS_TOTAL_COUNT = "users/SET_POSTS_TOTAL_COUNT",
	LIKE_POST = "profile/LIKE_POST",
	UNLIKE_POST = "profile/UNLIKE_POST",

	// messages
	SET_CHATS = "messages/SET_CHATS",
	SET_CHAT_WITH = 'messages/SET_CHAT_WITH',
	SET_MESSAGES = "messages/SET_MESSAGES",
	SET_MESSAGES_TOTAL_COUNT = 'messages/SET_MESSAGES_TOTAL_COUNT',
	SEND_MESSAGE = "messages/SEND_MESSAGE",
	MESSAGE_SENT = 'messages/MESSAGE_SENT',
	RECEIVE_MESSAGE = "messages/RECEIVE_MESSAGE",
	MESSAGES_READ = 'messages/MESSAGES_READ',

	// friends
	SET_WHOSE_FRIENDS = "friends/SET_WHOSE_FRIENDS",
	SET_FRIENDS = "friends/SET_FRIENDS",
	SET_FRIENDS_TOTAL_COUNT = "friends/SET_FRIENDS_TOTAL_COUNT",

	// users&profile&friends
	FOLLOW = "users&profile&friends/FOLLOW",
	UNFOLLOW = "users&profile&friends/UNFOLLOW",

	// users
	SET_USERS = "users/SET_USERS",
	SET_USERS_TOTAL_COUNT = "users/SET_USERS_TOTAL_COUNT",

	// settings
	SET_THEME = "settings/SET_THEME",
}