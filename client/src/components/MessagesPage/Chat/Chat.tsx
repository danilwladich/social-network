import React, { useEffect, useLayoutEffect, useRef } from "react";
import { MessagesMessageData } from "../../../models/Messages/MessagesMessageData";
import { ChatInput } from "./ChatInput";
import { Message } from "./Message";
import { ChatHeader } from "./ChatHeader";
import { ChatWith } from "../../../models/Messages/ChatWith";

interface IProps {
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	sendMessage: (message: string, id: number) => void;
}

export function Chat(props: IProps) {
	const messagesEnd = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		scrollBottom();
	}, []);

	useEffect(() => {
		if (props.messagesData[props.messagesData.length - 1].out) {
			scrollBottom();
		}
	}, [props.messagesData]);

	function scrollBottom() {
		messagesEnd.current?.scrollIntoView();
	}
	return (
		<>
			<div className="messages__chat">
				<ChatHeader chatWith={props.chatWith} />

				<div className="messages__content">
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

				<ChatInput sendMessage={props.sendMessage} />
			</div>
		</>
	);
}
