import React, { useEffect, useRef } from "react";
import { MessagesMessageData } from "../../../models/Messages/MessagesMessageData";
import { ChatInput } from "./ChatInput";
import { Message } from "./Message";
import { MessagesUserData } from "../../../models/Messages/MessagesUserData";
import { ChatHeader } from "./ChatHeader";

interface IProps {
	chatWith: MessagesUserData;
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
					{props.messagesData.map((m) => (
						<Message key={m.id} messageData={m} />
					))}
				</div>

				<ChatInput
					sendMessage={props.sendMessage}
					scrollAfterSend={scrollAfterSend}
				/>
			</div>
		</>
	);
}
