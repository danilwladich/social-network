import React from "react";
import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import { Chat } from "./Chat";
import { sendMessage } from "../../../redux/messagesReducer";
import { useParams } from "react-router-dom";
import { MessagesMessageData } from "../../../models/Messages/MessagesMessageData";
import { MessagesUserData } from "../../../models/Messages/MessagesUserData";

interface IProps {
	chatWith: MessagesUserData;
	messagesData: MessagesMessageData[];
	sendMessage: (v: string) => void;
}

export function ChatContainerAPI(props: IProps) {
	// eslint-disable-next-line
	const userID = useParams().id;

	return (
		<>
			<Chat
				chatWith={props.chatWith}
				messagesData={props.messagesData}
				sendMessage={props.sendMessage}
			/>
		</>
	);
}

function mapStateToProps(state: IState) {
	return {
		chatWith: state.messages.chatWith,
		messagesData: state.messages.messagesData,
	};
}

export const ChatContainer = connect(mapStateToProps, {
	sendMessage,
})(ChatContainerAPI);
