import React from "react";
import { NavLink } from "react-router-dom";
import { ProfileFollowUserData } from "../../../../../models/Profile/ProfileFollowUserData";

interface IProps {
	userData: ProfileFollowUserData;
	bodyTheme: string;
}

export function User(props: IProps) {
	const userData = props.userData;

	let userImage: string = `/images/user&theme=${props.bodyTheme}.jpg`;
	if (!!userData.image) {
		userImage = userData.image.split(".jpg")[0] + "&size=small.jpg";
	}

	return (
		<>
			<NavLink
				draggable="false"
				to={"/" + userData.nickname}
				className="profile__about_user"
			>
				<div
					className={
						"profile__about_user_image " + (userData.online ? "online" : "")
					}
				>
					<img src={userImage} alt={userData.nickname} />
				</div>

				<div className="profile__about_user_name">{userData.firstName}</div>
			</NavLink>
		</>
	);
}
