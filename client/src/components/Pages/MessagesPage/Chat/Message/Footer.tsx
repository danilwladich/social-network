import React from "react";
import { MessagesMessageData } from "../../../../../models/Messages/MessagesMessageData";
import { CheckMark } from "../../../../assets/CheckMark";

interface IProps {
	messageData: MessagesMessageData;
}

export function Footer(props: IProps) {
	const messageData = props.messageData;
	const time = messageData.date.split(" ")[3].slice(0, 5);
	return (
		<>
			<div className="messages__message_footer">
				{messageData.out && (
					<div
						className={
							"messages__message_status " + (messageData.read ? "read" : "")
						}
					>
						{messageData.id.includes("temporaryid") ? (
							<CheckMark />
						) : (
							<>
								<CheckMark />
								<CheckMark />
							</>
						)}
					</div>
				)}

				<span className="messages__message_date">{time}</span>
			</div>
		</>
	);
}
