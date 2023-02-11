import React from "react";
import { MessagesMessageData } from "../../../../models/Messages/MessagesMessageData";
import { CheckMark } from "../../../assets/CheckMark";

interface IProps {
	lastMessage: MessagesMessageData;
}

export function LastMessage(props: IProps) {
	const lastMessage = props.lastMessage;

	const date = lastMessage.date.split(" ");
	const dateNow = new Date().toString().split(" ").slice(1, 5);
	const dateToShow =
		date[0] === dateNow[0] && date[2] === dateNow[2]
			? date[1] === dateNow[1]
				? date[3].slice(0, 5)
				: date[0] + " " + date[1] + " " + date[3].slice(0, 5)
			: date[1] + " " + date[0] + " " + date[2];

	return (
		<>
			<div className="messages__user_lastmessage">
				<div className="messages__user_lastmessage_text">
					{(lastMessage.out ? "Me: " : "") + lastMessage.message}
				</div>

				{lastMessage.out && (
					<div
						className={
							"messages__user_lastmessage_status " +
							(lastMessage.read ? "read" : "")
						}
					>
						{lastMessage.id.includes("temporaryid") ? (
							<CheckMark />
						) : (
							<>
								<CheckMark />
								<CheckMark />
							</>
						)}
					</div>
				)}
				<div className="messages__user_lastmessage_date">{dateToShow}</div>
			</div>
		</>
	);
}
