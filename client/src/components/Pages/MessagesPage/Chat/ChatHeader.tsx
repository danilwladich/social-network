import React from "react";
import { NavLink } from "react-router-dom";
import { ChatWith } from "../../../../models/Messages/ChatWith";

interface IProps {
	chatWith: ChatWith;
	bodyTheme: string;
}

export function ChatHeader(props: IProps) {
	const chatWith = props.chatWith;

	let userImage: string = `/images/user&theme=${props.bodyTheme}.jpg`;
	if (!!chatWith.image) {
		userImage = chatWith.image.split(".jpg")[0] + "&size=small.jpg";
	}

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
					<img src={userImage} alt={chatWith.nickname} />
				</NavLink>
			</div>
		</>
	);
}
