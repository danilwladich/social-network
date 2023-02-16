import React, { useEffect } from "react";

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
		</>
	);
}
