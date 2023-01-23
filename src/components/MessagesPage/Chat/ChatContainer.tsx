import React, { useState } from "react";
import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import { Chat } from "./Chat";
import { sendMessage } from "../../../redux/messagesReducer";
import { useParams } from "react-router-dom";
import { MessagesMessageData } from "../../../models/Messages/MessagesMessageData";
import { ChatWith } from "../../../models/Messages/ChatWith";

interface IProps {
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	sendMessage: (message: string, id: number) => void;
}

export function ChatContainerAPI(props: IProps) {
	// eslint-disable-next-line
	const [isLoading, setIsLoading] = useState(false);
	// eslint-disable-next-line
	const userID = useParams().id;

	if (isLoading) {
		return <>{/* <FriendsPageLoading /> */}</>;
	} else if (!props.chatWith.id) {
		return <div className="messages__not_found">User not found</div>;
	} else {
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
