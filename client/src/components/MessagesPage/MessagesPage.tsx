import React, { useEffect } from "react";
import "./MessagesPage.css";
import { UsersContainer } from "./Users/UsersContainer";
import { ChatContainer } from "./Chat/ChatContainer";
import { useParams } from "react-router-dom";
import { socket } from "../../App";
import { MessagesMessageData } from "../../models/Messages/MessagesMessageData";
import { MessagesUserData } from "../../models/Messages/MessagesUserData";

interface IProps {
	messageSent: (oldID: string, newID: string) => void;
	receiveMessage: (
		messageData: MessagesMessageData,
		fromUser: MessagesUserData
	) => void;
	messagesRead: (userID: string) => void;
}

export function MessagesPage(props: IProps) {
	document.title = `Messages`;
	const userID = useParams().id;

	useEffect(() => {
		socket.on("receiveMessage", (data) => {
			props.receiveMessage(data.messageData, data.fromUser);
		});

		socket.on("messageSent", (data) => {
			props.messageSent(data.oldID, data.newID);
		});

		socket.on("messagesRead", (data) => {
			props.messagesRead(data.userID);
		});
		return () => {
			socket.off("receiveMessage").off();
			socket.off("messageSent").off();
			socket.off("messagesRead").off();
		};
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<section className="messages">
				<div className="subsection">
					{userID ? <ChatContainer /> : <UsersContainer />}
				</div>
			</section>
		</>
	);
}
