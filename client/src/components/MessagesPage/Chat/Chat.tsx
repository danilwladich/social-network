import React, { useEffect, useLayoutEffect, useRef } from "react";
import { MessagesMessageData } from "../../../models/Messages/MessagesMessageData";
import { ChatInput } from "./ChatInput";
import { Message } from "./Message";
import { ChatHeader } from "./ChatHeader";
import { ChatWith } from "../../../models/Messages/ChatWith";
import { socket } from "../../../App";
import { useNavigate } from "react-router-dom";

interface IProps {
	authID: string;
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	contentRef: React.RefObject<HTMLDivElement>;
	contentLock: boolean;
	sendMessage: (message: string, id: string) => void;
}

export function Chat(props: IProps) {
	const navigate = useNavigate();
	const messagesEnd = useRef<HTMLDivElement>(null);
	const contentRef = props.contentRef;
	const chatWith = props.chatWith;
	const readMessages =
		localStorage.getItem("readMessages") === "false" ? false : true;

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

			if (readMessages && !props.messagesData[0].read) {
				socket.emit("readMessages", {
					who: props.authID,
					whom: chatWith.id,
				});
			}
		}
		// eslint-disable-next-line
	}, [props.messagesData]);
	function scrollBottom() {
		messagesEnd.current?.scrollIntoView();
	}

	// set chat height
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", chatHeight);
		window.addEventListener("orientationchange", chatHeight);
		window.visualViewport?.addEventListener("resize", chatHeight);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", chatHeight);
			window.removeEventListener("orientationchange", chatHeight);
			window.visualViewport?.removeEventListener("resize", chatHeight);
		};
		// eslint-disable-next-line
	}, []);
	function chatHeight() {
		const doc = document.documentElement;
		doc.style.setProperty(
			"--chat-height",
			`${Math.min(
				window.visualViewport
					? window.visualViewport.height
					: window.innerHeight,
				document.documentElement.clientHeight
			)}px`
		);
	}
	const handleScroll = () => {
		window.scrollTo(0, 0);
	};
	chatHeight();

	return (
		<>
			<div className="messages__chat">
				<ChatHeader chatWith={chatWith} />

				<div className="messages__content" ref={contentRef}>
					{!!props.messagesData.length ? (
						<>
							{[...props.messagesData].reverse().map((m) => (
								<Message key={m.id} messageData={m} />
							))}

							<div
								style={{ float: "left", clear: "both" }}
								ref={messagesEnd}
							></div>
						</>
					) : (
						<div className="messages__content_nocontent">
							{`You haven't had chat with ${chatWith.firstName} ${chatWith.lastName} yet`}
						</div>
					)}
				</div>

				<ChatInput
					sendMessage={props.sendMessage}
					authID={props.authID}
					userID={chatWith.id}
					readMessages={readMessages}
				/>
			</div>
		</>
	);
}
