import { ChatWith } from "./ChatWith";
import { MessagesMessageData } from "./MessagesMessageData";
import { MessagesUserData } from "./MessagesUserData";

export interface IMessages {
	usersData: MessagesUserData[];
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	usersPageSize: number;
	usersTotalCount: number;
	messagesPageSize: number;
	messagesTotalCount: number;
	countOfUnreadMessages: string[];
}
