import React from "react";
import { NavLink } from "react-router-dom";
import { UsersUserData } from "../../../../models/Users/UsersUserData";
import { UserOnline } from "../../../assets/UserOnline";
import { Actions } from "./Actions";
import { useUserImage } from "./../../../../hooks/useUserImage";

interface IProps {
	isAuth: boolean;
	userData: UsersUserData;
	followButtonInProgress: boolean;
	setFollow: () => void;
	setUnfollow: () => void;
}

export function User(props: IProps) {
	const userData = props.userData;

	const userImage = useUserImage(userData.image, true);

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
					className="users__user_image"
				>
					<img loading="lazy" src={userImage} alt={userData.nickname} />

					<UserOnline
						className="users__user_online"
						online={userData.online}
						small
					/>
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
