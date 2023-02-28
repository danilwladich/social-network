import React, { useEffect, useRef, useState } from "react";
import { Arrow } from "../../../assets/Arrow";
import { socket } from "../../../../App";
import { useAppSelector } from "./../../../../hooks/useAppSelector";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import {
	readMessages,
	sendMessage,
} from "../../../../redux/reducers/messagesReducer";

const newMessagesDraft: {
	[key: string]: string;
} = JSON.parse(sessionStorage.getItem("newMessagesDraft") || "{}");

export function Input() {
	const dispatch = useAppDispatch();

	const { nickname: userNickname } = useAppSelector(
		(state) => state.messages.chatWith
	);
	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);

	const [newMessageValue, setNewMessageValue] = useState(
		newMessagesDraft[userNickname + "\\value"] || ""
	);

	const fieldRef = useRef<HTMLTextAreaElement>(null);

	const newMessageHeight =
		newMessagesDraft[userNickname + "\\height"] || "50px";
	const readMessagesOption =
		localStorage.getItem("readMessages") === "false" ? false : true;

	// first render scroll bottom
	useEffect(() => {
		fieldRef.current?.scrollTo(0, fieldRef.current.scrollHeight);
	}, []);

	function updateNewMessageValue(v: string) {
		if (v.length <= 5000) {
			newMessagesDraft[userNickname + "\\value"] = v;

			setNewMessageValue(v);
		}

		if (fieldRef.current!.scrollHeight + 4 < 285) {
			fieldRef.current!.style.height = "50px";

			fieldRef.current!.style.height =
				fieldRef.current!.scrollHeight + 4 + "px";

			newMessagesDraft[userNickname + "\\height"] =
				fieldRef.current!.scrollHeight + 4 + "px";
		} else {
			fieldRef.current!.style.height = "284px";

			newMessagesDraft[userNickname + "\\height"] = "284px";
		}

		if (v === "") {
			delete newMessagesDraft[userNickname + "\\value"];
			delete newMessagesDraft[userNickname + "\\height"];

			fieldRef.current!.style.height = "50px";
		}
		sessionStorage.setItem(
			"newMessagesDraft",
			JSON.stringify(newMessagesDraft)
		);
	}
	function sendMessageHandler() {
		if (newMessageValue.trim() !== "") {
			fieldRef.current?.focus();

			const from = authNickname;
			const to = userNickname;

			const id = "temporaryid//" + Math.round(Math.random() * 1000000000);

			socket.emit("sendMessage", {
				message: newMessageValue.trim(),
				from,
				to,
				id,
			});

			if (!readMessagesOption) {
				socket.emit("readMessages", {
					who: authNickname,
					whom: userNickname,
				});

				dispatch(readMessages(userNickname));
			}

			dispatch(sendMessage({ message: newMessageValue.trim(), id }));

			updateNewMessageValue("");
		}
	}
	function onKeyDownHandler(e: React.KeyboardEvent<HTMLSpanElement>) {
		if (!e.shiftKey && e.key === "Enter") {
			e.preventDefault();
			if (newMessageValue.trim() !== "") {
				sendMessageHandler();
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
					onClick={() => sendMessageHandler()}
					disabled={newMessageValue.trim() === ""}
					className="messages__chat_input_send"
				>
					<Arrow />
				</button>
			</div>
		</>
	);
}
