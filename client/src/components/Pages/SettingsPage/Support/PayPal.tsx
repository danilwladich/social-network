import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

declare global {
	interface Window {
		PayPal: any;
	}
}

interface IProps {
	isAuth: boolean;
	newDonationTC: (v: number) => Promise<void>;
}

export function PayPal(props: IProps) {
	useEffect(() => {
		const button = window.PayPal.Donation.Button({
			env: "production",
			hosted_button_id: "VRPNAEV6SJZHN",
			image: {
				src: "/images/paypal.jpg",
				alt: "Donate with PayPal button",
				title: "PayPal - The safer, easier way to pay online!",
			},
			onComplete: (params: any) => {
				if (props.isAuth) {
					props.newDonationTC(+params.amt);
				}
				alert(`Thank you very much for your support`);
			},
		});
		button.render(`#payPalButton`);
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<button id="payPalButton" className="settings__donation settings__button">
				PayPal
			</button>

			{!props.isAuth && (
				<div className="settings__donation_warning">
					!If you want to appear in the list below, you need to{" "}
					<NavLink to="/login">log in</NavLink>!
				</div>
			)}
		</>
	);
}
