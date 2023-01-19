import React from "react";
import "./MessagesPage.css";
import { UsersContainer } from "./Users/UsersContainer";
import { ChatContainer } from "./Chat/ChatContainer";

interface IProps {
	userID?: string;
}

export function MessagesPage(props: IProps) {
	return (
		<>
			<section className="messages">
				<div className="subsection">
					{props.userID ? <ChatContainer /> : <UsersContainer />}
				</div>
			</section>
		</>
	);
}
