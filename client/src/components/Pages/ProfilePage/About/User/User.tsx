import React from "react";
import { NavLink } from "react-router-dom";
import { ProfileFollowUserData } from "../../../../../models/Profile/ProfileFollowUserData";
import { UserOnline } from "../../../../assets/UserOnline";

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
				<div className="profile__about_user_image">
					<img src={userImage} alt={userData.nickname} />

					<UserOnline
						className="profile__about_user_online"
						online={userData.online}
						small
					/>
				</div>

				<div className="profile__about_user_name">{userData.firstName}</div>
			</NavLink>
		</>
	);
}
