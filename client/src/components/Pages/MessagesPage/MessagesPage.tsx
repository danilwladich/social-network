import React, { useEffect } from "react";
import "./MessagesPage.css";
import UsersContainer from "./Users/UsersContainer";
import ChatContainer from "./Chat/ChatContainer";
import { useParams } from "react-router-dom";
import { socket } from "../../../App";
import { Helmet } from "react-helmet";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import {
	messageSent,
	messagesRead,
	readMessages,
} from "../../../redux/reducers/messagesReducer";

export default function MessagesPage() {
	const dispatch = useAppDispatch();

	const userNickname = useParams().nickname;

	// sockets
	useEffect(() => {
		socket.on("messageSent", (data) => {
			dispatch(messageSent({ oldID: data.oldID, newID: data.newID }));
		});

		socket.on("messagesRead", (data) => {
			dispatch(messagesRead(data.userNickname));
		});

		socket.on("readMessages", (data) => {
			dispatch(readMessages(data.userNickname));
		});

		return () => {
			socket.off("messageSent");
			socket.off("messagesRead");
			socket.off("readMessages");
		};
	}, [dispatch]);

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
