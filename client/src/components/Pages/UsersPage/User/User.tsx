import React from "react";
import { NavLink } from "react-router-dom";
import { UsersUserData } from "../../../../models/Users/UsersUserData";
import { Actions } from "./Actions";

interface IProps {
	isAuth: boolean;
	userData: UsersUserData;
	followButtonInProgress: boolean;
	bodyTheme: string;
	setFollow: () => void;
	setUnfollow: () => void;
}

export function User(props: IProps) {
	const userData = props.userData;

	let userImage: string = `/images/user&theme=${props.bodyTheme}.jpg`;
	if (!!userData.image) {
		userImage = userData.image.split(".jpg")[0] + "&size=small.jpg";
	}

	let userLocation = "";
	if (!!userData.location.country) {
		userLocation += userData.location.country + " ";
	}
	if (!!userData.location.city) {
		userLocation += userData.location.city;
	}

	return (
		<>
			<div className="users__user">
				<NavLink
					to={"/" + userData.nickname}
					draggable="false"
					className={"users__user_image " + (userData.online ? "online" : "")}
				>
					<img loading="lazy" src={userImage} alt={userData.nickname} />
				</NavLink>

				<div className="users__user_info">
					<div className="users__user_name">
						<NavLink draggable="false" to={"/" + userData.nickname}>
							{userData.firstName + " " + userData.lastName}
						</NavLink>
					</div>

					<div className="users__user_location">{userLocation}</div>
				</div>

				<Actions {...props} />
			</div>
		</>
	);
}
