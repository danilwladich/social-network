import React, { useLayoutEffect, useState } from "react";
import { Support } from "./Support";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { fetchDonationsTC } from "../../../../redux/reducers/settingsReducer";
import { Helmet } from "react-helmet";

function SupportAPI() {
	const dispatch = useAppDispatch();

	const [isLoaded, setIsLoaded] = useState(!!window.PayPal);
	const [timer, setTimer] = useState<NodeJS.Timer>();

	// fetching
	useLayoutEffect(() => {
		dispatch(fetchDonationsTC());
	}, [dispatch]);

	// check if PayPal script loaded
	if (!isLoaded && !timer) {
		setTimer(
			setInterval(() => {
				console.log(1);
				if (!!window.PayPal) {
					setIsLoaded(!!window.PayPal);
				}
			}, 100)
		);
	}
	if (isLoaded && timer) {
		clearInterval(timer);
	}

	return (
		<>
			<Helmet>
				{!isLoaded && (
					<script src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js" />
				)}
			</Helmet>

			{isLoaded && <Support />}
		</>
	);
}

export default SupportAPI;
