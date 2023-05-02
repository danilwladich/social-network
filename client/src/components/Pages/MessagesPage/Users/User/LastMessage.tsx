import React from "react";
import { MessagesMessageData } from "../../../../../models/Messages/MessagesMessageData";
import { CheckMark } from "../../../../assets/svg/CheckMark";
import { useDateToShow } from "../../../../../hooks/useDateToShow";

interface IProps {
	lastMessage: MessagesMessageData;
}

export function LastMessage(props: IProps) {
	const lastMessage = props.lastMessage;

	const dateToShow = useDateToShow(lastMessage.date, true);

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

				<span className="messages__user_lastmessage_date">{dateToShow}</span>
			</div>
		</>
	);
}
