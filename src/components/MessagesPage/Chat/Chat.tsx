import React, { useEffect, useRef } from "react";
import { MessagesMessageData } from "../../../models/Messages/MessagesMessageData";
import { ChatInput } from "./ChatInput";
import { Message } from "./Message";
import { ChatHeader } from "./ChatHeader";
import { ChatWith } from "../../../models/Messages/ChatWith";

interface IProps {
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	sendMessage: (v: string) => void;
}

export function Chat(props: IProps) {
	const chatRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
	}, []);

	function scrollAfterSend() {
		chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
	}

	return (
		<>
			<div className="messages__chat">
				<ChatHeader chatWith={props.chatWith} />

				<div ref={chatRef} className="messages__content">
					{!!props.messagesData.length ? (
						props.messagesData.map((m) => (
							<Message key={m.id} messageData={m} />
						))
					) : (
						<div className="messages__content_nocontent">{`You haven't had chat with ${props.chatWith.firstName} ${props.chatWith.lastName} yet`}</div>
					)}
				</div>

				<ChatInput
					sendMessage={props.sendMessage}
					scrollAfterSend={scrollAfterSend}
				/>
			</div>
		</>
	);
}
