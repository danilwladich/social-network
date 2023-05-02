import React from "react";
import { MessagesMessageData } from "../../../../../models/Messages/MessagesMessageData";
import { CheckMark } from "../../../../assets/svg/CheckMark";
import moment from "moment";

interface IProps {
	messageData: MessagesMessageData;
}

export function Footer(props: IProps) {
	const messageData = props.messageData;
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

				<span className="messages__message_date">
					{moment(messageData.date).format("HH:mm")}
				</span>
			</div>
		</>
	);
}
