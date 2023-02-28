import React from "react";
import { User } from "./User/User";
import { PayPal } from "./PayPal";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "./../../../../hooks/useAppSelector";

export function Support() {
	const { donationsData, bodyTheme } = useAppSelector(
		(state) => state.settings
	);
	const { isAuth } = useAppSelector((state) => state.auth);

	return (
		<>
			<div className="settings__item">
				<h3 className="settings__category">Support project</h3>

				<PayPal />

				{!!donationsData.length && (
					<>
						{!isAuth && (
							<div className="settings__donation_warning">
								!If you want to appear in the list below, you need to{" "}
								<NavLink to="/login">log in</NavLink>!
							</div>
						)}

						<div className="settings__topdonations">
							<p className="settings__topdonations_title">Top 3 donations</p>

							<div className="settings__topdonations_items">
								{donationsData.map((donation) => (
									<User
										key={donation.nickname}
										donationData={donation}
										bodyTheme={bodyTheme}
									/>
								))}
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}
