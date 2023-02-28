import React, { useEffect } from "react";
import { Input } from "./Input";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";
import { Content } from "./Content";

interface IProps {
	isLoading: boolean;
	contentRef: React.RefObject<HTMLDivElement>;
	contentLock: boolean;
}

export function Chat(props: IProps) {
	const navigate = useNavigate();

	// go to all chats when esc pressed
	useEffect(() => {
		function keyDownHandler(e: KeyboardEvent) {
			if (e.key === "Escape") {
				navigate("/messages");
			}
		}

		window.addEventListener("keydown", keyDownHandler);
		return () => window.removeEventListener("keydown", keyDownHandler);
	}, [navigate]);

	return (
		<>
			<div className="messages__chat">
				<Header />

				<Content {...props} />

				<Input />
			</div>
		</>
	);
}
