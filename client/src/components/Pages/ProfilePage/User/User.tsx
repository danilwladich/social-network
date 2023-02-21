import React from "react";
import { ProfileUserData } from "../../../../models/Profile/ProfileUserData";

interface IProps {
	userData: ProfileUserData;
	bodyTheme: string;
}

export function User(props: IProps) {
	const userData = props.userData;
	document.title = `${userData.firstName + " " + userData.lastName}`;

	let userImage: string =
		userData.image || `/images/user&theme=${props.bodyTheme}.jpg`;

	let userLocation = "";
	if (!!userData.location.country) {
		userLocation += userData.location.country + " ";
	}
	if (!!userData.location.city) {
		userLocation += userData.location.city;
	}

	return (
		<>
			<div className="profile__user">
				<div
					className={"profile__user_image " + (userData.online ? "online" : "")}
				>
					<img src={userImage} alt={userData.nickname} />
				</div>

				<div className="profile__user_info">
					<h2 className="profile__user_name">
						{userData.firstName + " " + userData.lastName}
					</h2>

					<div className="profile__user_location">{userLocation}</div>
				</div>
			</div>
		</>
	);
}
