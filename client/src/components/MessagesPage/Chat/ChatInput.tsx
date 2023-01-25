import React, { useRef, useState } from "react";
import { Arrow } from "../../assets/Arrow";

interface IProps {
	sendMessage: (message: string, id: number) => void;
}

export function ChatInput(props: IProps) {
	const [newMessageValue, setNewMessageValue] = useState("");
	const fieldRef = useRef<HTMLTextAreaElement>(null);

	function updateNewMessageValue(v: string) {
		if (v.length < 5000) {
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
		if (newMessageValue.trim() !== "") {
			props.sendMessage(newMessageValue, 1);
		}
	}
	function onKeyDownHandler(
		e: React.KeyboardEvent<HTMLSpanElement>,
		disabled: boolean
	) {
		if (!e.shiftKey && e.key === "Enter") {
			e.preventDefault();
			if (!disabled) {
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
					onKeyDown={(e) => onKeyDownHandler(e, newMessageValue.trim() === "")}
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
