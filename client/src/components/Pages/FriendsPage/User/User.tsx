import React from "react";
import { NavLink } from "react-router-dom";
import { FriendsUserData } from "../../../../models/Friends/FriendsUserData";
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
	return (
		<>
			<div className="friends__user">
				<NavLink
					to={"/" + userData.nickname}
					draggable="false"
					className={"friends__user_image " + (userData.online ? "online" : "")}
				>
					<img
						loading="lazy"
						src={userData.image || `/images/user&theme=${props.bodyTheme}.jpg`}
						alt={userData.nickname}
					/>
				</NavLink>

				<div className="friends__user_info">
					<div className="friends__user_name">
						<NavLink draggable="false" to={"/" + userData.nickname}>
							{userData.firstName + " " + userData.lastName}
						</NavLink>
					</div>

					<div className="friends__user_location">
						<p>{userData.location.country}</p>
						<p>{userData.location.city}</p>
					</div>
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
