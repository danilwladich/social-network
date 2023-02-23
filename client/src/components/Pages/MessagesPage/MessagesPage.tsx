import React, { useEffect } from "react";
import "./MessagesPage.css";
import { UsersContainer } from "./Users/UsersContainer";
import { ChatContainer } from "./Chat/ChatContainer";
import { useParams } from "react-router-dom";
import { socket } from "../../../App";
import { Helmet } from "react-helmet";

interface IProps {
	messageSent: (oldID: string, newID: string) => void;
	messagesRead: (userNickname: string) => void;
	readMessages: (userNickname: string) => void;
}

export function MessagesPage(props: IProps) {
	const userNickname = useParams().nickname;

	// sockets
	useEffect(() => {
		socket.on("messageSent", (data) => {
			props.messageSent(data.oldID, data.newID);
		});

		socket.on("messagesRead", (data) => {
			props.messagesRead(data.userNickname);
		});

		socket.on("readMessages", (data) => {
			props.readMessages(data.userNickname);
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
			<Helmet>
				<title>Messages</title>
			</Helmet>

			<section className="messages">
				<div className="subsection">
					{userNickname ? <ChatContainer /> : <UsersContainer />}
				</div>
			</section>
		</>
	);
}
