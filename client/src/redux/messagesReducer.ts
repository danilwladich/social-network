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
		id: "",
		firstName: "",
		lastName: "",
		image: "",
	},
	messagesData: [],
	pageSize: 50,
	totalCount: 0,
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
					{ ...action.fromUser, lastMessage: action.messageData },
					...state.usersData.filter((u) => u.id !== action.fromUser.id),
				],
				messagesData:
					action.fromUser.id === state.chatWith.id
						? [action.messageData, ...state.messagesData]
						: state.messagesData,
			};

		case ActionType.MESSAGES_READ:
			return {
				...state,
				usersData: state.usersData.map((u) => {
					if (u.lastMessage.out) {
						return { ...u, lastMessage: { ...u.lastMessage, read: true } };
					}
					return u;
				}),
				messagesData:
					action.value === state.chatWith.id
						? state.messagesData.map((m) => {
								if (m.out) {
									return { ...m, read: true };
								}
								return m;
						  })
						: state.messagesData,
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

export const messagesRead: (userID: string) => IAction = (userID) => ({
	type: ActionType.MESSAGES_READ,
	value: userID,
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

export const getChatTC = (userID: string, page: number, pageSize: number) => {
	return async (dispatch: Dispatch<IAction>, getState: () => IState) => {
		try {
			dispatch(setErrorMessage(""));
			const lastMessageID =
				page > 1
					? getState().messages.messagesData[
							getState().messages.messagesData.length - 1
					  ].id
					: null;

			await API.getChat(userID, page, pageSize, lastMessageID).then((data) => {
				if (data.success === true) {
					dispatch(setMessages(data.messagesData, page));
					if (page === 1) {
						dispatch(setChatWith(data.chatWith));
						dispatch(setMessagesTotalCount(data.totalCount));
					}
				} else {
					dispatch(
						setChatWith({
							id: "",
							firstName: "",
							lastName: "",
							image: "",
						})
					);
					dispatch(setMessages([], 1));
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get chat: " + error.message));
		}
	};
};
