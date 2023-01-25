import React from "react";
import "./MessagesPage.css";
import { UsersContainer } from "./Users/UsersContainer";
import { ChatContainer } from "./Chat/ChatContainer";
import { useParams } from "react-router-dom";

interface IProps {

}

export function MessagesPage(props: IProps) {
	document.title = `Messages`;
	const userID = useParams().id;
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
