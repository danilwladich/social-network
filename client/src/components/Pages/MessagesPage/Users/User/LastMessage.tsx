import React from "react";
import { MessagesMessageData } from "../../../../../models/Messages/MessagesMessageData";
import { CheckMark } from "../../../../assets/CheckMark";
import { DateToShow } from "../../../../assets/DateToShow";

interface IProps {
	lastMessage: MessagesMessageData;
}

export function LastMessage(props: IProps) {
	const lastMessage = props.lastMessage;
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
				
				<div className="messages__user_lastmessage_date">
					<DateToShow date={lastMessage.date} short/>
				</div>
			</div>
		</>
	);
}
