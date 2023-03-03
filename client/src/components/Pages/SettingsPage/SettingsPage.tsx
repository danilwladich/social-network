import React from "react";
import "./SettingsPage.css";
import { General } from "./General/General";
import { Account } from "./Account/Account";
import { Copyright } from "./Copyright/Copyright";
import { Messages } from "./Messages/Messages";
import SupportContainer from "./Support/SupportContainer";
import { Helmet } from "react-helmet";
import { useAppSelector } from "./../../../hooks/useAppSelector";

export default function SettingsPage() {
	const { isAuth } = useAppSelector((state) => state.auth);
	return (
		<>
			<Helmet>
				<title>Settings</title>
				{!window.PayPal && (
					<script src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js" />
				)}
			</Helmet>

			<section className="settings">
				<div className="subsection">
					<div className="settings__items">
						<General />

						{isAuth && (
							<>
								<Messages />

								<Account />
							</>
						)}

						<Copyright />

						<SupportContainer />
					</div>
				</div>
			</section>
		</>
	);
}
