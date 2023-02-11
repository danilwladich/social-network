import React from "react";
import { DonationData } from "../../../models/Settings/DonationData";
import { User } from "./User";
import { PayPal } from "./PayPal";

interface IProps {
	bodyTheme: string;
	donationsData: DonationData[];
	newDonationTC: (v: number) => Promise<void>;
}

export function Support(props: IProps) {
	return (
		<>
			<div className="settings__item">
				<h3 className="settings__category">Support project</h3>

				<PayPal newDonationTC={props.newDonationTC} />

				{!!props.donationsData.length && (
					<div className="settings__topdonations">
						<p className="settings__topdonations_title">Top 3 donations</p>
						<div className="settings__topdonations_items">
							{props.donationsData.map((d) => (
								<User key={d.nickname} donationData={d} />
							))}
						</div>
					</div>
				)}
			</div>
		</>
	);
}
