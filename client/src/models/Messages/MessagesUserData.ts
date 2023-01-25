import { MessagesMessageData } from "./MessagesMessageData";

export interface MessagesUserData {
	id: string;
	firstName: string;
	lastName: string;
	image?: string;
	lastMessage: MessagesMessageData;
}
