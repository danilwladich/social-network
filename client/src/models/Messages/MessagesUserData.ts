import { MessagesMessageData } from "./MessagesMessageData";

export interface MessagesUserData {
	nickname: string;
	firstName: string;
	lastName: string;
	image?: string;
	lastMessage: MessagesMessageData;
	online: string | boolean;
}
