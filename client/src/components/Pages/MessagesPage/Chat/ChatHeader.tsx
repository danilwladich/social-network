import React from "react";
import { NavLink } from "react-router-dom";
import { ChatWith } from "../../../../models/Messages/ChatWith";

interface IProps {
	chatWith: ChatWith;
}

export function ChatHeader(props: IProps) {
	const chatWith = props.chatWith;
	return (
		<>
			<div className="messages__chat_header">
				<NavLink
					to="/messages"
					draggable="false"
					className="messages__chat_header_back"
				>
					Back
				</NavLink>

				<NavLink
					to={"/" + chatWith.nickname}
					draggable="false"
					className="messages__chat_header_name"
				>
					{chatWith.firstName + " " + chatWith.lastName}
				</NavLink>

				<NavLink
					to={"/" + chatWith.nickname}
					draggable="false"
					className={
						"messages__chat_header_image " + (chatWith.online ? "online" : "")
					}
				>
					<img
						src={chatWith.image || "/images/user.jpg"}
						alt={chatWith.nickname}
					/>
				</NavLink>
			</div>
		</>
	);
}
