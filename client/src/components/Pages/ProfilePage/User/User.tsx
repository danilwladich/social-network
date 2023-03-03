import React from "react";
import { Helmet } from "react-helmet";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { Image } from "./Image/Image";

export function User() {
	const { userData } = useAppSelector((state) => state.profile);

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
				<title>{userData.firstName + " " + userData.lastName}</title>
			</Helmet>

			<div className="profile__user">
				<Image userData={userData} />

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
