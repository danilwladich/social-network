import React from "react";
import { GeneralContainer } from "./General/GeneralContainer";
import { AccountContainer } from "./Account/AccountContainer";
import "./SettingsPage.css";
import { Copyright } from "./Copyright/Copyright";
import { Messages } from "./Messages/Messages";
import { SupportContainer } from "./Support/SupportContainer";
import { Helmet } from "react-helmet";

interface IProps {
	isAuth: boolean;
}

export function SettingsPage(props: IProps) {
	return (
		<>
			<Helmet>
				<title>Settings</title>
			</Helmet>

			<section className="settings">
				<div className="subsection">
					<div className="settings__items">
						<GeneralContainer />

						{props.isAuth && (
							<>
								<Messages />

								<AccountContainer />
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
