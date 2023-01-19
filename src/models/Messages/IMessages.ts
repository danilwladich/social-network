import { MessagesMessageData } from "./MessagesMessageData";
import { MessagesUserData } from "./MessagesUserData";

export interface IMessages {
	usersData: MessagesUserData[];
	chatWith: MessagesUserData;
	messagesData: MessagesMessageData[];
}
