import React, { useLayoutEffect, useState } from "react";
import { IState } from "../../../models/IState";
import { connect } from "react-redux";
import { Chat } from "./Chat";
import { sendMessage } from "../../../redux/messagesReducer";
import { useParams } from "react-router-dom";
import { MessagesMessageData } from "../../../models/Messages/MessagesMessageData";
import { ChatWith } from "../../../models/Messages/ChatWith";
import { getChatTC } from "./../../../redux/messagesReducer";

interface IProps {
	authID: string;
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	getChatTC: (userID: string) => Promise<void>;
	sendMessage: (message: string, id: string) => void;
}

export function ChatContainerAPI(props: IProps) {
	const [isLoading, setIsLoading] = useState(false);
	const userID = useParams().id;

	useLayoutEffect(() => {
		if (!!userID) {
			setIsLoading(true);
			props.getChatTC(userID).finally(() => {
				setIsLoading(false);
			});
		}
		// eslint-disable-next-line
	}, []);

	if (isLoading) {
		return <>Loading...</>; // TODO
	} else if (!props.chatWith.id) {
		return <div className="messages__not_found">User not found</div>;
	} else {
		return (
			<>
				<Chat {...props} />
			</>
		);
	}
}

function mapStateToProps(state: IState) {
	return {
		authID: state.auth.user.id,
		chatWith: state.messages.chatWith,
		messagesData: state.messages.messagesData,
	};
}

export const ChatContainer = connect(mapStateToProps, {
	getChatTC,
	sendMessage,
})(ChatContainerAPI);
