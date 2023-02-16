import React from "react";
import { DonationData } from "../../../../models/Settings/DonationData";
import { User } from "./User";
import { PayPal } from "./PayPal";
import { NavLink } from "react-router-dom";

interface IProps {
	isAuth: boolean;
	bodyTheme: string;
	donationsData: DonationData[];
	newDonationTC: (v: number) => Promise<void>;
}

export function Support(props: IProps) {
	return (
		<>
			<div className="settings__item">
				<h3 className="settings__category">Support project</h3>

				<PayPal newDonationTC={props.newDonationTC} isAuth={props.isAuth} />

				{!!props.donationsData.length && (
					<>
						{!props.isAuth && (
							<div className="settings__donation_warning">
								!If you want to appear in the list below, you need to{" "}
								<NavLink to="/login">log in</NavLink>!
							</div>
						)}

						<div className="settings__topdonations">
							<p className="settings__topdonations_title">Top 3 donations</p>
							<div className="settings__topdonations_items">
								{props.donationsData.map((d) => (
									<User key={d.nickname} donationData={d} />
								))}
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}
