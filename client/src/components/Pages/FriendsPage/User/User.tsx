import React from "react";
import { NavLink } from "react-router-dom";
import { FriendsUserData } from "../../../../models/Friends/FriendsUserData";
import { UserOnline } from "../../../assets/UserOnline";
import { Actions } from "./Actions";

interface IProps {
	isAuth: boolean;
	itsMe: boolean;
	userData: FriendsUserData;
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
			<div className="friends__user">
				<NavLink
					to={"/" + userData.nickname}
					draggable="false"
					className="friends__user_image"
				>
					<img loading="lazy" src={userImage} alt={userData.nickname} />

					<UserOnline
						className="friends__user_online"
						online={userData.online}
						small
					/>
				</NavLink>

				<div className="friends__user_info">
					<div className="friends__user_name">
						<NavLink draggable="false" to={"/" + userData.nickname}>
							{userData.firstName + " " + userData.lastName}
						</NavLink>
					</div>

					<div className="friends__user_location">{userLocation}</div>
				</div>

				{!props.itsMe ? (
					<Actions {...props} />
				) : (
					<div className="friends__user_itsme">Me</div>
				)}
			</div>
		</>
	);
}
