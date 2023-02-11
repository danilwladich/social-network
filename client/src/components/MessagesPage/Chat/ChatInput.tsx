import React, { useLayoutEffect, useRef, useState } from "react";
import { Arrow } from "../../assets/Arrow";
import { socket } from "../../../App";

interface IProps {
	authNickname: string;
	userNickname: string;
	readMessagesOption: boolean;
	sendMessage: (message: string, id: string) => void;
	readMessages: (userNickname: string) => void;
}

const newMessagesDraft: {
	[key: string]: string;
} = JSON.parse(sessionStorage.getItem("newMessagesDraft") || "{}");

export function ChatInput(props: IProps) {
	const [newMessageValue, setNewMessageValue] = useState(
		newMessagesDraft[props.userNickname + "\\value"] || ""
	);
	const fieldRef = useRef<HTMLTextAreaElement>(null);
	const newMessageHeight =
		newMessagesDraft[props.userNickname + "\\height"] || "50px";

	// first render scroll bottom
	useLayoutEffect(() => {
		fieldRef.current?.scrollTo(0, fieldRef.current.scrollHeight);
	}, []);

	function updateNewMessageValue(v: string) {
		if (v.length <= 5000) {
			newMessagesDraft[props.userNickname + "\\value"] = v;

			sessionStorage.setItem(
				"newMessagesDraft",
				JSON.stringify(newMessagesDraft)
			);

			setNewMessageValue(v);
		}

		if (fieldRef.current!.scrollHeight + 4 < 300) {
			fieldRef.current!.style.height = "50px";

			fieldRef.current!.style.height =
				fieldRef.current!.scrollHeight + 4 + "px";

			newMessagesDraft[props.userNickname + "\\height"] =
				fieldRef.current!.scrollHeight + 4 + "px";

			sessionStorage.setItem(
				"newMessagesDraft",
				JSON.stringify(newMessagesDraft)
			);
		}

		if (v === "") {
			delete newMessagesDraft[props.userNickname + "\\value"];
			delete newMessagesDraft[props.userNickname + "\\height"];

			sessionStorage.setItem(
				"newMessagesDraft",
				JSON.stringify(newMessagesDraft)
			);

			fieldRef.current!.style.height = "50px";
		}
	}
	function sendMessage() {
		if (newMessageValue.trim() !== "") {
			fieldRef.current?.focus();
			updateNewMessageValue("");

			const from = props.authNickname;
			const to = props.userNickname;

			const id = "temporaryid//" + Math.round(Math.random() * 1000000000);

			socket.emit("sendMessage", {
				message: newMessageValue.trim(),
				from,
				to,
				id,
			});

			if (!props.readMessagesOption) {
				socket.emit("readMessages", {
					who: props.authNickname,
					whom: props.userNickname,
				});

				props.readMessages(props.userNickname);
			}

			props.sendMessage(newMessageValue.trim(), id);
		}
	}
	function onKeyDownHandler(e: React.KeyboardEvent<HTMLSpanElement>) {
		if (!e.shiftKey && e.key === "Enter") {
			e.preventDefault();
			if (newMessageValue.trim() !== "") {
				sendMessage();
			}
		}
	}
	
	return (
		<>
			<div className="messages__chat_input">
				<textarea
					ref={fieldRef}
					autoFocus
					onKeyDown={(e) => onKeyDownHandler(e)}
					onChange={(e) => updateNewMessageValue(e.target.value)}
					value={newMessageValue}
					style={{ height: newMessageHeight }}
					placeholder="Write new message..."
					className="messages__chat_input_field"
				/>

				<button
					onClick={() => sendMessage()}
					disabled={newMessageValue.trim() === ""}
					className="messages__chat_input_send"
				>
					<Arrow />
				</button>
			</div>
		</>
	);
}
