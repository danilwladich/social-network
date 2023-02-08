import { ChatWith } from "./ChatWith";
import { MessagesMessageData } from "./MessagesMessageData";
import { MessagesUserData } from "./MessagesUserData";

export interface IMessages {
	usersData: MessagesUserData[];
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	pageSize: number;
	totalCount: number;
	countOfUnreadMessages: string[];
}
