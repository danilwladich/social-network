import React from "react";
import { UserOnline } from "../../../assets/UserOnline";
import { Helmet } from "react-helmet";
import { useAppSelector } from "../../../../hooks/useAppSelector";

export function User() {
	const { bodyTheme } = useAppSelector((state) => state.settings);
	const { userData } = useAppSelector((state) => state.profile);

	let userImage: string =
		userData.image || `/images/user&theme=${bodyTheme}.jpg`;

	let userLocation = "";
	if (!!userData.location.country) {
		userLocation += userData.location.country + " ";
	}
	if (!!userData.location.city) {
		userLocation += userData.location.city;
	}

	return (
		<>
			<Helmet>
				<title>{`${userData.firstName} ${userData.lastName}`}</title>
			</Helmet>

			<div className="profile__user">
				<div className="profile__user_image">
					<img src={userImage} alt={userData.nickname} />

					<UserOnline
						online={userData.online}
						className="profile__user_online"
					/>
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
