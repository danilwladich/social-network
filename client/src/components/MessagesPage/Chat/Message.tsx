import React from "react";
import { MessagesMessageData } from "../../../models/Messages/MessagesMessageData";

interface IProps {
	messageData: MessagesMessageData;
}

export function Message(props: IProps) {
	const messageData = props.messageData;
	const time = messageData.date.split(" ")[3].slice(0, 5);
	return (
		<>
			<div className={"messages__message " + (messageData.out ? "out" : "")}>
				<div className="messages__message_content">
					<div className="messages__message_row">
						<span className="messages__message_text">
							{messageData.message}
						</span>
						<span className="messages__message_date">{time}</span>
					</div>
				</div>
			</div>
		</>
	);
}
