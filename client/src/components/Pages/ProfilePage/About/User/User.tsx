import React from "react";
import { NavLink } from "react-router-dom";
import { useUserImage } from "../../../../../hooks/useUserImage";
import { ProfileFollowUserData } from "../../../../../models/Profile/ProfileFollowUserData";
import { UserOnline } from "../../../../assets/UserOnline";

interface IProps {
	userData: ProfileFollowUserData;
}

export function User(props: IProps) {
	const userData = props.userData;

	const userImage = useUserImage(userData.image, true);

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
