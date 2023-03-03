import React from "react";
import { NavLink } from "react-router-dom";
import { useUserImage } from "../../../../hooks/useUserImage";
import { UserOnline } from "../../../assets/UserOnline";
import { useAppSelector } from "./../../../../hooks/useAppSelector";

export function Header() {
	const { chatWith } = useAppSelector((state) => state.messages);

	const userImage = useUserImage(chatWith.image, true);

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
