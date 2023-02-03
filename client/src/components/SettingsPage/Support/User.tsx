import React from "react";
import { DonationData } from "../../../models/Settings/DonationData";
import { NavLink } from "react-router-dom";

interface IProps {
	donationData: DonationData;
}

export function User(props: IProps) {
	const donationData = props.donationData;
	return (
		<>
			<NavLink
				to={"/" + donationData.id}
				className="settings__topdonations_item"
			>
				<div className="settings__topdonations_image">
					<img
						src={donationData.image || "/images/user.jpg"}
						alt={donationData.id}
					/>
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