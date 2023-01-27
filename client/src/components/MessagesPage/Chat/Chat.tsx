import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MessagesMessageData } from "../../../models/Messages/MessagesMessageData";
import { ChatInput } from "./ChatInput";
import { Message } from "./Message";
import { ChatHeader } from "./ChatHeader";
import { ChatWith } from "../../../models/Messages/ChatWith";
import { socket } from "../../../App";

interface IProps {
	authID: string;
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	sendMessage: (message: string, id: string) => void;
}

// TODO exis chat on escape key down

export function Chat(props: IProps) {
	const messagesEnd = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [contentLock, setContentLock] = useState(true);

	// first render scroll bottom
	useLayoutEffect(() => {
		scrollBottom();
	}, []);

	// set contentLock based on scrollTop
	useEffect(() => {
		function scrollHandler() {
			if (contentRef.current !== null)
				if (
					contentRef.current.scrollHeight -
						(contentRef.current.scrollTop + contentRef.current.clientHeight) >
					50
				) {
					setContentLock(false);
				} else if (
					contentRef.current.scrollHeight -
						(contentRef.current.scrollTop + contentRef.current.clientHeight) ===
					0
				) {
					setContentLock(true);
				}
		}

		contentRef.current?.addEventListener("scroll", scrollHandler);
		return () => {
			// eslint-disable-next-line
			contentRef.current?.removeEventListener("scroll", scrollHandler);
		};
	});

	// scroll bottom after get and send messages + read messages socket
	useEffect(() => {
		if (!!props.messagesData.length) {
			if (props.messagesData[props.messagesData.length - 1].out) {
				scrollBottom();
			} else {
				if (contentLock) {
					scrollBottom();
				}
				if (!props.messagesData[props.messagesData.length - 1].read) {
					socket.emit("readMessages", {
						who: props.authID,
						whom: props.chatWith.id,
					});
				}
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
				<ChatHeader chatWith={props.chatWith} />

				<div className="messages__content" ref={contentRef}>
					{!!props.messagesData.length ? (
						<>
							{props.messagesData.map((m) => (
								<Message key={m.id} messageData={m} />
							))}

							<div
								style={{ float: "left", clear: "both" }}
								ref={messagesEnd}
							></div>
						</>
					) : (
						<div className="messages__content_nocontent">{`You haven't had chat with ${props.chatWith.firstName} ${props.chatWith.lastName} yet`}</div>
					)}
				</div>

				<ChatInput
					sendMessage={props.sendMessage}
					authID={props.authID}
					userID={props.chatWith.id}
				/>
			</div>
		</>
	);
}
