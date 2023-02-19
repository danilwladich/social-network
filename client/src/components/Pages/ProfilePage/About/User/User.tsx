import React from "react";
import { NavLink } from "react-router-dom";
import { ProfileFollowUserData } from "../../../../../models/Profile/ProfileFollowUserData";

interface IProps {
	user: ProfileFollowUserData;
}

export function User(props: IProps) {
	const user = props.user;
	return (
		<>
			<NavLink
				draggable="false"
				to={"/" + user.nickname}
				className="profile__about_user"
			>
				<div
					className={
						"profile__about_user_image " + (user.online ? "online" : "")
					}
				>
					<img src={user.image || "/images/user.jpg"} alt={user.nickname} />
				</div>

				<div className="profile__about_user_name">{user.firstName}</div>
			</NavLink>
		</>
	);
}
