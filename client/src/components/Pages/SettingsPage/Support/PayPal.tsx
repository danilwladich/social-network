import React, { useEffect } from "react";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { newDonationTC } from "../../../../redux/reducers/settingsReducer";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";

declare global {
	interface Window {
		PayPal: any;
	}
}

export function PayPal() {
	const dispatch = useAppDispatch();

	const { isAuth } = useAppSelector((state) => state.auth);

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
				if (isAuth) {
					dispatch(newDonationTC(+params.amt));
				}
				alert("Thank you very much for your support");
			},
		});
		button.render("#payPalButton");
	}, [isAuth, dispatch]);

	return (
		<>
			<button id="payPalButton" className="settings__donation settings__button">
				PayPal
			</button>
		</>
	);
}
