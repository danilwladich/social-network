import React from "react";
import { NavLink } from "react-router-dom";
import { MessagesUserData } from "../../../models/Messages/MessagesUserData";

interface IProps {
	userData: MessagesUserData;
}

export function User(props: IProps) {
	const userData = props.userData;
	return (
		<>
			<NavLink
				to={"/messages/" + userData.id}
				draggable="false"
				className="messages__user"
			>
				<div className="messages__user_image">
					<img
						loading="lazy"
						src={userData.image || "/images/user.jpg"}
						alt={userData.id}
					/>
				</div>
				<div className="messages__user_info">
					<div className="messages__user_name">
						{userData.firstName + " " + userData.lastName}
					</div>
				</div>
			</NavLink>
		</>
	);
}
