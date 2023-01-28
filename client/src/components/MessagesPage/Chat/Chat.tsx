import React, { useEffect, useRef } from "react";
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
	contentRef: React.RefObject<HTMLDivElement>;
	contentLock: boolean;
	sendMessage: (message: string, id: string) => void;
}

// TODO exis chat on escape key down

export function Chat(props: IProps) {
	const messagesEnd = useRef<HTMLDivElement>(null);
	const contentRef = props.contentRef;

	// scroll bottom after get and send messages + read messages socket
	useEffect(() => {
		if (!!props.messagesData.length) {
			if (props.contentLock) {
				scrollBottom();
			}
			if (!props.messagesData[0].read) {
				socket.emit("readMessages", {
					who: props.authID,
					whom: props.chatWith.id,
				});
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
							{[...props.messagesData].reverse().map((m) => (
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
