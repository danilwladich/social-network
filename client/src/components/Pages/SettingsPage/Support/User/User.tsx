import React from "react";
import { DonationData } from "../../../../../models/Settings/DonationData";
import { NavLink } from "react-router-dom";

interface IProps {
	donationData: DonationData;
	bodyTheme: string;
}

export function User(props: IProps) {
	const donationData = props.donationData;

	let userImage: string = `/images/user&theme=${props.bodyTheme}.jpg`;
	if (!!donationData.image) {
		userImage = donationData.image.split(".jpg")[0] + "&size=small.jpg";
	}

	return (
		<>
			<NavLink
				draggable="false"
				to={"/" + donationData.nickname}
				className="settings__topdonations_item"
			>
				<div className="settings__topdonations_image">
					<img src={userImage} alt={donationData.nickname} />
				</div>

				<div className="settings__topdonations_name">
					{donationData.firstName + " " + donationData.lastName}
				</div>

				<div className="settings__topdonations_value">
					$ {donationData.value}
				</div>
			</NavLink>
		</>
	);
}
