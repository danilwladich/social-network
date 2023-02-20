import { AxiosError } from "axios";
import { Dispatch } from "redux";
import { API } from "../API/API";
import { ActionType } from "../models/Action/ActionType";
import { IAction } from "../models/Action/IAction";
import { ChatWith } from "../models/Messages/ChatWith";
import { IMessages } from "../models/Messages/IMessages";
import { MessagesMessageData } from "../models/Messages/MessagesMessageData";
import { MessagesUserData } from "../models/Messages/MessagesUserData";
import { setErrorMessage } from "./appReducer";
import { IState } from "./../models/IState";

const initialState: IMessages = {
	usersData: [],
	chatWith: {
		nickname: "",
		firstName: "",
		lastName: "",
		image: "",
		online: false,
	},
	messagesData: [],
	pageSize: 50,
	totalCount: 0,
	countOfUnreadMessages: [],
};

export function messagesReducer(
	state: IMessages = initialState,
	action: IAction
) {
	switch (action.type) {
		case ActionType.SET_CHATS:
			return {
				...state,
				usersData: [...action.value],
			};

		case ActionType.SET_CHAT_WITH:
			return {
				...state,
				chatWith: action.value,
			};

		case ActionType.SET_MESSAGES:
			return {
				...state,
				messagesData:
					action.page === 1
						? [...action.messagesData]
						: [...state.messagesData, ...action.messagesData],
			};

		case ActionType.SET_MESSAGES_TOTAL_COUNT:
			return {
				...state,
				totalCount: action.value,
			};

		case ActionType.DELETE_CHAT:
			return {
				...state,
				usersData: state.usersData.filter((u) => u.nickname !== action.value),
			};

		case ActionType.SEND_MESSAGE:
			const newMessage = {
				id: action.id,
				message: action.value,
				date: new Date().toString().split(" ").slice(1, 5).join(" "),
				out: true,
				read: false,
			};
			return {
				...state,
				messagesData: [newMessage, ...state.messagesData],
			};

		case ActionType.MESSAGE_SENT:
			return {
				...state,
				messagesData: state.messagesData.map((m) => {
					if (m.id === action.oldID) {
						return { ...m, id: action.newID };
					}
					return m;
				}),
			};

		case ActionType.RECEIVE_MESSAGE:
			return {
				...state,

				usersData: [
					{ ...action.fromUser, lastMessage: action.messageData, online: true },
					...state.usersData.filter(
						(u) => u.nickname !== action.fromUser.nickname
					),
				],

				chatWith: { ...state.chatWith, online: true },

				messagesData:
					action.fromUser.nickname === state.chatWith.nickname
						? [action.messageData, ...state.messagesData]
						: state.messagesData,

				countOfUnreadMessages: state.countOfUnreadMessages.includes(
					action.fromUser.nickname
				)
					? [...state.countOfUnreadMessages]
					: [...state.countOfUnreadMessages, action.fromUser.nickname],
			};

		case ActionType.MESSAGES_READ:
			return {
				...state,

				usersData: state.usersData.map((u) => {
					if (u.nickname === action.value && u.lastMessage.out) {
						return {
							...u,
							lastMessage: { ...u.lastMessage, read: true },
							online: true,
						};
					}
					return u;
				}),

				chatWith: { ...state.chatWith, online: true },

				messagesData:
					action.value === state.chatWith.nickname
						? state.messagesData.map((m) => {
								if (m.out) {
									return { ...m, read: true };
								}
								return m;
						  })
						: state.messagesData,
			};

		case ActionType.READ_MESSAGES:
			return {
				...state,
				countOfUnreadMessages: state.countOfUnreadMessages.filter(
					(nickname) => nickname !== action.value
				),
			};

		case ActionType.SET_COUNT_OF_UNREAD_MESSAGES:
			return {
				...state,
				countOfUnreadMessages: action.value,
			};

		case ActionType.DELETE_MESSAGE:
			return {
				...state,
				messagesData: state.messagesData.filter(
					(m) => m.id !== action.messageID
				),
			};

		case ActionType.MESSAGE_DELETE:
			return {
				...state,

				messagesData:
					state.chatWith.nickname === action.fromUser
						? state.messagesData.filter((m) => m.id !== action.messageID)
						: [...state.messagesData],

				usersData: !!action.penultimateMessageData
					? state.usersData.map((u) => {
							if (
								u.nickname === action.fromUser &&
								u.lastMessage.id === action.messageID
							) {
								return {
									...u,
									lastMessage: { ...action.penultimateMessageData, out: false },
								};
							}
							return u;
					  })
					: [...state.usersData],

				countOfUnreadMessages: action.penultimateMessageData?.read
					? state.countOfUnreadMessages.filter(
							(nickname) => nickname !== action.fromUser
					  )
					: [...state.countOfUnreadMessages],
			};

		default:
			return state;
	}
}

// action
export const setChats: (usersData: MessagesUserData[]) => IAction = (
	usersData
) => ({
	type: ActionType.SET_CHATS,
	value: usersData,
});

export const setChatWith: (chatWith: ChatWith) => IAction = (chatWith) => ({
	type: ActionType.SET_CHAT_WITH,
	value: chatWith,
});

export const setMessages: (
	messagesData: MessagesMessageData[],
	page: number
) => IAction = (messagesData, page) => ({
	type: ActionType.SET_MESSAGES,
	messagesData,
	page,
});

export const setMessagesTotalCount: (count: number) => IAction = (count) => ({
	type: ActionType.SET_MESSAGES_TOTAL_COUNT,
	value: count,
});

export const deleteChat: (userNickname: string) => IAction = (
	userNickname
) => ({
	type: ActionType.DELETE_CHAT,
	value: userNickname,
});

export const sendMessage: (message: string, id: string) => IAction = (
	message,
	id
) => ({
	type: ActionType.SEND_MESSAGE,
	value: message,
	id,
});

export const messageSent: (oldID: string, newID: string) => IAction = (
	oldID,
	newID
) => ({
	type: ActionType.MESSAGE_SENT,
	oldID,
	newID,
});

export const receiveMessage: (
	messageData: MessagesMessageData,
	fromUser: MessagesUserData
) => IAction = (messageData, fromUser) => ({
	type: ActionType.RECEIVE_MESSAGE,
	messageData,
	fromUser,
});

export const messagesRead: (userNickname: string) => IAction = (
	userNickname
) => ({
	type: ActionType.MESSAGES_READ,
	value: userNickname,
});

export const readMessages: (userNickname: string) => IAction = (
	userNickname
) => ({
	type: ActionType.READ_MESSAGES,
	value: userNickname,
});

export const setCountOfUnreadMessages: (count: string[]) => IAction = (
	count
) => ({
	type: ActionType.SET_COUNT_OF_UNREAD_MESSAGES,
	value: count,
});

export const deleteMessage: (messageID: string) => IAction = (messageID) => ({
	type: ActionType.DELETE_MESSAGE,
	messageID,
});

export const messageDelete: (
	fromUser: string,
	messageID: string,
	penultimateMessageData?: MessagesMessageData
) => IAction = (fromUser, messageID, penultimateMessageData) => ({
	type: ActionType.MESSAGE_DELETE,
	fromUser,
	messageID,
	penultimateMessageData,
});

// thunk
export const getChatsTC = () => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.getChats().then((data) => {
				if (data.success === true) {
					dispatch(setChats(data.usersData));
				} else {
					dispatch(setChats([]));
					dispatch(setErrorMessage("Get chats: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get chats: " + error.message));
		}
	};
};

export const getChatTC = (
	userNickname: string,
	page: number,
	pageSize: number
) => {
	return async (dispatch: Dispatch<IAction>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			const lastMessageID =
				page > 1
					? getState().messages.messagesData[
							getState().messages.messagesData.length - 1
					  ].id
					: null;

			await API.getChat(userNickname, page, pageSize, lastMessageID).then(
				(data) => {
					if (data.success === true) {
						dispatch(setMessages(data.messagesData, page));
						if (page === 1) {
							dispatch(setChatWith(data.chatWith));
							dispatch(setMessagesTotalCount(data.totalCount));
						}
					} else {
						dispatch(
							setChatWith({
								nickname: "",
								firstName: "",
								lastName: "",
								image: "",
								online: false,
							})
						);
						dispatch(setMessages([], 1));
					}
				}
			);
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get chat: " + error.message));
		}
	};
};

export const deleteChatTC = (userNickname: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.deleteChat(userNickname).then((data) => {
				if (data.success === true) {
					dispatch(deleteChat(userNickname));
				} else {
					dispatch(setErrorMessage("Delete chat: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Delete chat: " + error.message));
		}
	};
};

export const getCountOfUnreadMessagesTC = () => {
	return async (dispatch: Dispatch<any>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.getCountOfUnreadMessages().then((data) => {
				if (data.success === true) {
					dispatch(setCountOfUnreadMessages(data.count));
				} else {
					dispatch(setCountOfUnreadMessages([]));
					dispatch(
						setErrorMessage("Get count of unread mesages: " + data.statusText)
					);
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(
				setErrorMessage("Get count of unread mesages: " + error.message)
			);
		}
	};
};

export const deleteMessageTC = (messageID: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.deleteMessage(messageID).then((data) => {
				if (data.success === true) {
					dispatch(deleteMessage(messageID));
				} else {
					dispatch(setErrorMessage("Delete message: " + data.statusText));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Delete message: " + error.message));
		}
	};
};
