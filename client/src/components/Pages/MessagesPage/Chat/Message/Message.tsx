import React, { useRef, useState } from "react";
import { useUrlifyText } from "../../../../../hooks/useUrlifyText";
import { MessagesMessageData } from "../../../../../models/Messages/MessagesMessageData";
import { LoadingCircle } from "../../../../assets/LoadingCircle";
import { MessageFooter } from "./MessageFooter";

interface IProps {
	messageData: MessagesMessageData;
	index: number;
	date?: string;
	deleteButtonInProgress: boolean;
	deleteMessage: () => void;
}

export function Message(props: IProps) {
	const messageTextRef = useRef<HTMLDivElement>(null);
	const [waitingClick, setWaitingClick] = useState<NodeJS.Timeout | null>(null);
	const [lastClick, setLastClick] = useState(0);
	const [showActions, setShowActions] = useState(false);

	const messageData = props.messageData;

	// show actions on double click
	const processClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (messageData.out && !messageData.id.includes("temporaryid")) {
			if (lastClick && e.timeStamp - lastClick <= 300 && waitingClick) {
				setLastClick(0);
				clearTimeout(waitingClick);
				setWaitingClick(null);
				setShowActions(true);
			} else {
				setLastClick(e.timeStamp);
				setWaitingClick(setTimeout(() => setWaitingClick(null), 300));
			}
		}
	};

	useUrlifyText(messageData.message, messageTextRef);

	return (
		<>
			{!!props.date && <div className="messages__date">{props.date}</div>}

			<div
				onMouseLeave={() => setShowActions(false)}
				onClick={(e) => processClick(e)}
				className={"messages__message " + (messageData.out ? "out" : "")}
			>
				<div className="messages__message_content">
					<span className="messages__message_text" ref={messageTextRef}>
						{messageData.message}
					</span>

					<MessageFooter messageData={messageData} />

					{messageData.out && !messageData.id.includes("temporaryid") && (
						<div className="messages__message_actions">
							<button
								onClick={() => props.deleteMessage()}
								className={
									"messages__message_actions_delete " +
									(showActions ? "active" : "")
								}
							>
								{props.deleteButtonInProgress ? <LoadingCircle /> : "Delete"}
							</button>
						</div>
					)}
				</div>

				<div className="messages__message_spacer" />
			</div>
		</>
	);
}
