import React from "react";
import { ProfileUserData } from "../../../../models/Profile/ProfileUserData";

interface IProps {
	userData: ProfileUserData;
	bodyTheme: string;
}

export function User(props: IProps) {
	const userData = props.userData;
	document.title = `${userData.firstName + " " + userData.lastName}`;
	return (
		<>
			<div className="profile__user">
				<div
					className={"profile__user_image " + (userData.online ? "online" : "")}
				>
					<img
						src={userData.image || `/images/user&theme=${props.bodyTheme}.jpg`}
						alt={userData.nickname}
					/>
				</div>

				<div className="profile__user_info">
					<h2 className="profile__user_name">
						{userData.firstName + " " + userData.lastName}
					</h2>

					<div className="profile__user_location">
						<p>{userData.location.country}</p>
						<p>{userData.location.city}</p>
					</div>
				</div>
			</div>
		</>
	);
}
