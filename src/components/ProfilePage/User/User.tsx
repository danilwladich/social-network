import React from "react";
import { ProfileUserData } from "../../../models/Profile/ProfileUserData";

interface IProps {
	userData: ProfileUserData;
}

export function User(props: IProps) {
	const userData = props.userData;
	document.title = `${userData.firstName + " " + userData.lastName}`;
	return (
		<>
			<div className="profile__user">
				<div className="profile__user_image">
					<img src={userData.image || "/images/user.jpg"} alt={userData.id} />
				</div>
				<h2 className="profile__user_name">
					{userData.firstName + " " + userData.lastName}
				</h2>
			</div>
		</>
	);
}
