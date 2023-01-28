import React, { useRef, useState } from "react";
import { Arrow } from "../../assets/Arrow";
import { socket } from "../../../App";

interface IProps {
	authID: string;
	userID: string;
	sendMessage: (message: string, id: string) => void;
}

export function ChatInput(props: IProps) {
	const [newMessageValue, setNewMessageValue] = useState("");
	const fieldRef = useRef<HTMLTextAreaElement>(null);

	function updateNewMessageValue(v: string) {
		if (v.length <= 5000) {
			setNewMessageValue(v);
		}
		if (fieldRef.current!.scrollHeight + 4 < 300) {
			fieldRef.current!.style.height = "50px";
			fieldRef.current!.style.height =
				fieldRef.current!.scrollHeight + 4 + "px";
		}
		if (v === "") {
			fieldRef.current!.style.height = "50px";
		}
	}
	function sendMessage() {
		updateNewMessageValue("");

		const from = props.authID;
		const to = props.userID;

		const id = "temporaryid//" + Math.round(Math.random() * 1000000000);

		socket.emit("sendMessage", {
			message: newMessageValue.trim(),
			from,
			to,
			id,
		});

		if ((newMessageValue.trim() !== "")) {
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
			<div className="messages__field">
				<textarea
					ref={fieldRef}
					autoFocus
					onKeyDown={(e) => onKeyDownHandler(e)}
					onChange={(e) => updateNewMessageValue(e.target.value)}
					value={newMessageValue}
					placeholder="Write new message..."
					className="messages__field_input"
				/>

				<button
					onClick={() => sendMessage()}
					disabled={newMessageValue.trim() === ""}
					className="messages__field_send"
				>
					<Arrow />
				</button>
			</div>
		</>
	);
}