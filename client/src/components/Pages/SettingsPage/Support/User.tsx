import React from "react";
import { DonationData } from "../../../../models/Settings/DonationData";
import { NavLink } from "react-router-dom";

interface IProps {
	donationData: DonationData;
	bodyTheme: string;
}

export function User(props: IProps) {
	const donationData = props.donationData;
	return (
		<>
			<NavLink
				draggable="false"
				to={"/" + donationData.nickname}
				className="settings__topdonations_item"
			>
				<div className="settings__topdonations_image">
					<img
						src={
							donationData.image || `/images/user&theme=${props.bodyTheme}.jpg`
						}
						alt={donationData.nickname}
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
