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

const initialState: IMessages = {
	usersData: [],
	chatWith: {
		id: "",
		firstName: "",
		lastName: "",
		image: "",
	},
	messagesData: [],
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

		case ActionType.SET_CHAT:
			return {
				...state,
				chatWith: action.chatWith,
				messagesData: [...action.messagesData],
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
				messagesData: [...state.messagesData, newMessage],
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
						? [...state.messagesData, action.messageData]
						: state.messagesData,
			};

		case ActionType.MESSAGES_READ:
			return {
				...state,
				usersData: state.usersData.map((u) => {
					if (u.lastMessage.out) {
						return { ...u, lastMessage: {...u.lastMessage, read: true} };
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

export const setChat: (
	chatWith: ChatWith,
	messagesData: MessagesMessageData[]
) => IAction = (chatWith, messagesData) => ({
	type: ActionType.SET_CHAT,
	chatWith,
	messagesData,
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

export const getChatTC = (userID: string) => {
	return async (dispatch: Dispatch<IAction>) => {
		try {
			dispatch(setErrorMessage(""));
			await API.getChat(userID).then((data) => {
				if (data.success === true) {
					dispatch(setChat(data.chatWith, data.messagesData));
				} else {
					dispatch(
						setChat(
							{
								id: "",
								firstName: "",
								lastName: "",
								image: "",
							},
							[]
						)
					);
				}
			});
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get chat: " + error.message));
		}
	};
};
