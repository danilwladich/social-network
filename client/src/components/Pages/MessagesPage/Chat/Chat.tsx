import React, { useEffect } from "react";
import { MessagesMessageData } from "../../../../models/Messages/MessagesMessageData";
import { Input } from "./Input";
import { Header } from "./Header";
import { ChatWith } from "../../../../models/Messages/ChatWith";
import { useNavigate } from "react-router-dom";
import { Content } from "./Content";

interface IProps {
	authNickname: string;
	chatWith: ChatWith;
	messagesData: MessagesMessageData[];
	contentRef: React.RefObject<HTMLDivElement>;
	contentLock: boolean;
	bodyTheme: string;
	sendMessage: (message: string, id: string) => void;
	readMessages: (userNickname: string) => void;
	deleteMessageTC: (messageID: string) => Promise<void>;
}

export function Chat(props: IProps) {
	const navigate = useNavigate();

	const readMessagesOption =
		localStorage.getItem("readMessages") === "false" ? false : true;

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

	return (
		<>
			<div className="messages__chat">
				<Header chatWith={props.chatWith} bodyTheme={props.bodyTheme} />

				<Content {...props} readMessagesOption={readMessagesOption} />

				<Input
					authNickname={props.authNickname}
					userNickname={props.chatWith.nickname}
					readMessagesOption={readMessagesOption}
					sendMessage={props.sendMessage}
					readMessages={props.readMessages}
				/>
			</div>
		</>
	);
}
