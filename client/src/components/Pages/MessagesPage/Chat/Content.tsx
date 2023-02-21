import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { socket } from "../../../../App";
import { ChatWith } from "../../../../models/Messages/ChatWith";
import { MessagesMessageData } from "../../../../models/Messages/MessagesMessageData";
import { Message } from "./Message/Message";

interface IProps {
	authNickname: string;
	messagesData: MessagesMessageData[];
	chatWith: ChatWith;
	contentRef: React.RefObject<HTMLDivElement>;
	contentLock: boolean;
	readMessagesOption: boolean;
	readMessages: (userNickname: string) => void;
	deleteMessageTC: (messageID: string) => Promise<void>;
}

export function Content(props: IProps) {
	const [deleteButtonsInProgress, setDeleteButtonsInProgress] = useState<
		string[]
	>([]);
	const messagesEnd = useRef<HTMLDivElement>(null);

	const chatWith = props.chatWith;
	const reverseMessageData = [...props.messagesData].reverse();

	// first render scroll bottom
	useLayoutEffect(() => {
		scrollBottom();
	}, []);

	// scroll bottom after get and send messages + read messages socket
	useEffect(() => {
		if (!!props.messagesData.length) {
			if (props.contentLock) {
				scrollBottom();
			}

			if (props.readMessagesOption && !props.messagesData[0].read) {
				socket.emit("readMessages", {
					who: props.authNickname,
					whom: chatWith.nickname,
				});

				props.readMessages(chatWith.nickname);
			}
		}
		// eslint-disable-next-line
	}, [props.messagesData]);
	function scrollBottom() {
		messagesEnd.current?.scrollIntoView();
	}

	// return date if message before has a different date or this is the first message
	function checkMessageDate(index: number) {
		const date = reverseMessageData[index].date.split(" ");
		const dateBefore = reverseMessageData[index - 1]?.date.split(" ");
		const dateNow = new Date().toString().split(" ").slice(1, 5);

		if (
			(dateBefore &&
				date.slice(0, 3).join(" ") !== dateBefore.slice(0, 3).join(" ")) ||
			index === 0
		) {
			const dateToShow =
				date[0] === dateNow[0] && date[2] === dateNow[2]
					? date[1] === dateNow[1]
						? "Today"
						: date[0] + " " + date[1]
					: date[1] + " " + date[0] + " " + date[2];

			return dateToShow;
		}
	}

	// delete message
	function deleteMessage(messageID: string) {
		setDeleteButtonsInProgress((prev) => [...prev, messageID]);
		props
			.deleteMessageTC(messageID)
			.then(() => {
				socket.emit("deleteMessage", {
					from: props.authNickname,
					to: chatWith.nickname,
					messageID,
					// return penultimate message if the deleted message was the last one
					penultimateMessageData:
						props.messagesData[0].id === messageID
							? props.messagesData[1]
							: undefined,
				});
			})
			.finally(() =>
				setDeleteButtonsInProgress((prev) =>
					prev.filter((id) => id !== messageID)
				)
			);
	}

	return (
		<>
			<div className="messages__chat_content" ref={props.contentRef}>
				{!!props.messagesData.length ? (
					<>
						{reverseMessageData.map((m, index) => (
							<Message
								key={m.id}
								messageData={m}
								index={index}
								date={checkMessageDate(index)}
								deleteButtonInProgress={deleteButtonsInProgress.some(
									(id) => id === m.id
								)}
								deleteMessage={() => deleteMessage(m.id)}
							/>
						))}

						<div
							style={{ float: "left", clear: "both" }}
							ref={messagesEnd}
						></div>
					</>
				) : (
					<div className="messages__chat_content_no_content">
						{`You haven't had chat with ${chatWith.firstName} ${chatWith.lastName} yet`}
					</div>
				)}
			</div>
		</>
	);
}
