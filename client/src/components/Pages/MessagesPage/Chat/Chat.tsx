import React, { useEffect, useLayoutEffect, useRef } from "react";
import { MessagesMessageData } from "../../../../models/Messages/MessagesMessageData";
import { ChatInput } from "./ChatInput";
import { Message } from "./Message";
import { ChatHeader } from "./ChatHeader";
import { ChatWith } from "../../../../models/Messages/ChatWith";
import { socket } from "../../../../App";
import { useNavigate } from "react-router-dom";

interface IProps {
	authNickname: string;
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	contentRef: React.RefObject<HTMLDivElement>;
	contentLock: boolean;
	sendMessage: (message: string, id: string) => void;
	readMessages: (userNickname: string) => void;
}

export function Chat(props: IProps) {
	const navigate = useNavigate();
	const messagesEnd = useRef<HTMLDivElement>(null);
	const contentRef = props.contentRef;
	const chatWith = props.chatWith;
	const readMessagesOption =
		localStorage.getItem("readMessages") === "false" ? false : true;
	const reverseMessageData = [...props.messagesData].reverse();

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

	// first render scroll bottom
	useLayoutEffect(() => {
		scrollBottom();
	}, []);

	// go to all chats when esc pressed
	useEffect(() => {
		window.addEventListener("keydown", keyDownHandler);
		return () => {
			window.removeEventListener("keydown", keyDownHandler);
		};
		// eslint-disable-next-line
	}, []);
	function keyDownHandler(e: KeyboardEvent) {
		if (e.key === "Escape") {
			navigate("/messages");
		}
	}

	// scroll bottom after get and send messages + read messages socket
	useEffect(() => {
		if (!!props.messagesData.length) {
			if (props.contentLock) {
				scrollBottom();
			}

			if (readMessagesOption && !props.messagesData[0].read) {
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

	return (
		<>
			<div className="messages__chat">
				<ChatHeader chatWith={chatWith} />

				<div className="messages__chat_content" ref={contentRef}>
					{!!props.messagesData.length ? (
						<>
							{reverseMessageData.map((m, index) => (
								<Message
									key={m.id}
									messageData={m}
									index={index}
									checkMessageDate={checkMessageDate}
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

				<ChatInput
					authNickname={props.authNickname}
					userNickname={chatWith.nickname}
					readMessagesOption={readMessagesOption}
					sendMessage={props.sendMessage}
					readMessages={props.readMessages}
				/>
			</div>
		</>
	);
}