import React from "react";
import { NavLink } from "react-router-dom";
import { ChatWith } from "../../../models/Messages/ChatWith";

interface IProps {
	chatWith: ChatWith;
}

export function ChatHeader(props: IProps) {
	const chatWith = props.chatWith;
	return (
		<>
			<div className="messages__header">
				<NavLink
					to="/messages"
					draggable="false"
					className="messages__header_back"
				>
					<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
						<path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"></path>
					</svg>
					Back
				</NavLink>

				<NavLink
					to={"/" + chatWith.id}
					draggable="false"
					className="messages__header_name"
				>
					{chatWith.firstName + " " + chatWith.lastName}
				</NavLink>

				<NavLink
					to={"/" + chatWith.id}
					draggable="false"
					className="messages__header_image"
				>
					<img src={chatWith.image || "/images/user.jpg"} alt={chatWith.id} />
				</NavLink>
			</div>
		</>
	);
}
