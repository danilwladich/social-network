import React from "react";
import { NavLink } from "react-router-dom";
import { ChatWith } from "../../../../models/Messages/ChatWith";
import { UserOnline } from "../../../assets/UserOnline";

interface IProps {
	chatWith: ChatWith;
	bodyTheme: string;
}

export function Header(props: IProps) {
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
					className="messages__chat_header_image"
				>
					<img src={userImage} alt={chatWith.nickname} />

					<UserOnline
						className="messages__chat_header_online"
						online={chatWith.online}
						small
					/>
				</NavLink>
			</div>
		</>
	);
}
