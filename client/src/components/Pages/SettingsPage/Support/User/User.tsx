import React from "react";
import { DonationData } from "../../../../../models/Settings/DonationData";
import { NavLink } from "react-router-dom";
import { useUserImage } from "../../../../../hooks/useUserImage";

interface IProps {
	donationData: DonationData;
}

export function User(props: IProps) {
	const donationData = props.donationData;

	const userImage = useUserImage(donationData.image, true);

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
