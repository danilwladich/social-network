import React from "react";
import { MessagesMessageData } from "../../../../models/Messages/MessagesMessageData";
import { CheckMark } from "../../../assets/CheckMark";

interface IProps {
	messageData: MessagesMessageData;
	index: number;
	checkMessageDate: (index: number) => string | undefined;
}

export function Message(props: IProps) {
	const messageData = props.messageData;
	const time = messageData.date.split(" ")[3].slice(0, 5);

	return (
		<>
			{!!props.checkMessageDate(props.index) && (
				<div className="messages__date">
					{props.checkMessageDate(props.index)}
				</div>
			)}

			<div className={"messages__message " + (messageData.out ? "out" : "")}>
				<div className="messages__message_content">
					<span className="messages__message_text">{messageData.message}</span>

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
				</div>
				<div className="messages__message_spacer" />
			</div>
		</>
	);
}
