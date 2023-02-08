import React, { useEffect } from "react";
import "./MessagesPage.css";
import { UsersContainer } from "./Users/UsersContainer";
import { ChatContainer } from "./Chat/ChatContainer";
import { useParams } from "react-router-dom";
import { socket } from "../../App";

interface IProps {
	messageSent: (oldID: string, newID: string) => void;
	messagesRead: (userID: string) => void;
	readMessages: (userID: string) => void;
}

export function MessagesPage(props: IProps) {
	document.title = `Messages`;
	const userID = useParams().id;

	// sockets
	useEffect(() => {
		socket.on("messageSent", (data) => {
			props.messageSent(data.oldID, data.newID);
		});

		socket.on("messagesRead", (data) => {
			props.messagesRead(data.userID);
		});

		socket.on("readMessages", (data) => {
			props.readMessages(data.userID);
		});

		return () => {
			socket.off("messageSent");
			socket.off("messagesRead");
			socket.off("readMessages");
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
