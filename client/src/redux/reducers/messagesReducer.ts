import { AxiosError } from "axios";
import { IMessages } from "../../models/Messages/IMessages";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { MessagesUserData } from "../../models/Messages/MessagesUserData";
import { ChatWith } from "../../models/Messages/ChatWith";
import { MessagesMessageData } from "../../models/Messages/MessagesMessageData";
import { IState } from "../store";
import { setErrorMessage } from "./appReducer";
import { API } from "../../API/API";
import { ServerResponse } from "./../../models/ServerResponse";

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
	usersPageSize: 30,
	usersTotalCount: 0,
	messagesPageSize: 50,
	messagesTotalCount: 0,
	countOfUnreadMessages: [],
};

// slice
const messagesSlice = createSlice({
	name: "messages",
	initialState,
	reducers: {
		setChats: (state, action: PayloadAction<MessagesUserData[]>) => {
			state.usersData = action.payload;
		},
		setChatWith: (state, action: PayloadAction<ChatWith>) => {
			state.chatWith = action.payload;
		},
		setMessages: (
			state,
			action: PayloadAction<{
				messagesData: MessagesMessageData[];
				page: number;
			}>
		) => {
			if (action.payload.page === 1) {
				state.messagesData = action.payload.messagesData;
			} else {
				state.messagesData.push(...action.payload.messagesData);
			}
		},
		setMessagesTotalCount: (state, action: PayloadAction<number>) => {
			state.messagesTotalCount = action.payload;
		},
		deleteChat: (state, action: PayloadAction<string>) => {
			state.usersData = state.usersData.filter(
				(user) => user.nickname !== action.payload
			);
		},
		sendMessage: (
			state,
			action: PayloadAction<{ message: string; id: string }>
		) => {
			const newMessage = {
				id: action.payload.id,
				message: action.payload.message,
				date: new Date().toString().split(" ").slice(1, 5).join(" "),
				out: true,
				read: false,
			};

			state.messagesData.unshift(newMessage);
		},
		messageSent: (
			state,
			action: PayloadAction<{ oldID: string; newID: string }>
		) => {
			state.messagesData = state.messagesData.map((message) => {
				if (message.id === action.payload.oldID) {
					return { ...message, id: action.payload.newID };
				}
				return message;
			});
		},
		receiveMessage: (
			state,
			action: PayloadAction<{
				messageData: MessagesMessageData;
				fromUser: MessagesUserData;
			}>
		) => {
			state.usersData = [
				{
					...action.payload.fromUser,
					lastMessage: action.payload.messageData,
					online: true,
				},
				...state.usersData.filter(
					(user) => user.nickname !== action.payload.fromUser.nickname
				),
			];

			if (action.payload.fromUser.nickname === state.chatWith.nickname) {
				state.chatWith.online = true;
				state.messagesData.unshift(action.payload.messageData);
			}

			if (
				!state.countOfUnreadMessages.includes(action.payload.fromUser.nickname)
			) {
				state.countOfUnreadMessages.push(action.payload.fromUser.nickname);
			}
		},
		messagesRead: (state, action: PayloadAction<string>) => {
			state.usersData = state.usersData.map((user) => {
				if (user.nickname === action.payload && user.lastMessage.out) {
					return {
						...user,
						lastMessage: { ...user.lastMessage, read: true },
						online: true,
					};
				}
				return user;
			});

			if (action.payload === state.chatWith.nickname) {
				state.chatWith.online = true;
				state.messagesData = state.messagesData.map((message) => {
					if (message.out && !message.read) {
						return { ...message, read: true };
					}
					return message;
				});
			}
		},
		readMessages: (state, action: PayloadAction<string>) => {
			state.countOfUnreadMessages = state.countOfUnreadMessages.filter(
				(nickname) => nickname !== action.payload
			);
		},
		setCountOfUnreadMessages: (state, action: PayloadAction<string[]>) => {
			state.countOfUnreadMessages = action.payload;
		},
		deleteMessage: (state, action: PayloadAction<string>) => {
			state.messagesData = state.messagesData.filter(
				(message) => message.id !== action.payload
			);
		},
		messageDelete: (
			state,
			action: PayloadAction<{
				fromUserNickname: string;
				messageID: string;
				penultimateMessageData?: MessagesMessageData;
			}>
		) => {
			if (state.chatWith.nickname === action.payload.fromUserNickname) {
				state.messagesData = state.messagesData.filter(
					(message) => message.id !== action.payload.messageID
				);
			}

			if (action.payload.penultimateMessageData) {
				state.usersData = state.usersData.map((user) => {
					if (
						user.nickname === action.payload.fromUserNickname &&
						user.lastMessage.id === action.payload.messageID
					) {
						return {
							...user,
							lastMessage: {
								...action.payload.penultimateMessageData!,
								out: false,
							},
						};
					}
					return user;
				});

				if (action.payload.penultimateMessageData.read) {
					state.countOfUnreadMessages = state.countOfUnreadMessages.filter(
						(nickname) => nickname !== action.payload.fromUserNickname
					);
				}
			}
		},
	},
});

// thunks
export const fetchChatsTC = createAsyncThunk<
	void,
	{ page: number; pageSize: number },
	{ state: IState }
>(
	"messages/getChatsTC",
	async ({ page, pageSize }, { dispatch, getState, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			let lastChatLastMessageID: string | null = null;
			if (page > 1) {
				lastChatLastMessageID =
					getState().messages.usersData[
						getState().messages.usersData.length - 1
					].lastMessage.id;
			}

			const data = (await API.getChats(
				page,
				pageSize,
				lastChatLastMessageID
			)) as ServerResponse<{ usersData: MessagesUserData[] }>;
			const items = data.items;

			if (data.success === true) {
				dispatch(setChats(items.usersData));
			} else {
				dispatch(setChats([]));
				dispatch(setErrorMessage("Get chats: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get chats: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const fetchChatTC = createAsyncThunk<
	void,
	{
		userNickname: string;
		page: number;
		pageSize: number;
	},
	{ state: IState }
>(
	"messages/getChatTC",
	async (
		{ userNickname, page, pageSize },
		{ dispatch, getState, rejectWithValue }
	) => {
		dispatch(setErrorMessage(""));
		try {
			let lastMessageID: string | null = null;
			if (page > 1) {
				lastMessageID =
					getState().messages.messagesData[
						getState().messages.messagesData.length - 1
					].id;
			}

			const data = (await API.getChat(
				userNickname,
				page,
				pageSize,
				lastMessageID
			)) as ServerResponse<{
				messagesData: MessagesMessageData[];
				chatWith: ChatWith;
				totalCount: number;
			}>;
			const items = data.items;

			if (data.success === true) {
				dispatch(setMessages({ messagesData: items.messagesData, page }));
				if (page === 1) {
					dispatch(setChatWith(items.chatWith));
					dispatch(setMessagesTotalCount(items.totalCount));
				}
			} else {
				dispatch(setChatWith(initialState.chatWith));
				dispatch(setMessages({ messagesData: [], page: 1 }));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Get chat: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const deleteChatTC = createAsyncThunk<void, string>(
	"messages/deleteChatTC",
	async (userNickname, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.deleteChat(userNickname)) as ServerResponse;

			if (data.success === true) {
				dispatch(deleteChat(userNickname));
			} else {
				dispatch(setErrorMessage("Delete chat: " + data.statusText));
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Delete chat: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const fetchCountOfUnreadMessagesTC = createAsyncThunk(
	"messages/fetchCountOfUnreadMessagesTC",
	async (_, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.getCountOfUnreadMessages()) as ServerResponse<{
				count: string[];
			}>;
			const items = data.items;

			if (data.success === true) {
				dispatch(setCountOfUnreadMessages(items.count));
			} else {
				dispatch(setCountOfUnreadMessages([]));
				dispatch(
					setErrorMessage("Get count of unread mesages: " + data.statusText)
				);
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(
				setErrorMessage("Get count of unread mesages: " + error.message)
			);
			return rejectWithValue(error.message);
		}
	}
);

export const deleteMessageTC = createAsyncThunk<void, string>(
	"messages/deleteMessageTC",
	async (messageID, { dispatch, rejectWithValue }) => {
		dispatch(setErrorMessage(""));
		try {
			const data = (await API.deleteMessage(messageID)) as ServerResponse;

			if (data.success === true) {
				dispatch(deleteMessage(messageID));
			} else {
				dispatch(setErrorMessage("Delete message: " + data.statusText));
				throw new Error(data.statusText);
			}
		} catch (e: unknown) {
			const error = e as AxiosError;
			dispatch(setErrorMessage("Delete message: " + error.message));
			return rejectWithValue(error.message);
		}
	}
);

export const {
	setChats,
	setChatWith,
	setMessages,
	setMessagesTotalCount,
	deleteChat,
	sendMessage,
	messageSent,
	receiveMessage,
	messagesRead,
	readMessages,
	setCountOfUnreadMessages,
	deleteMessage,
	messageDelete,
} = messagesSlice.actions;

export default messagesSlice.reducer;
