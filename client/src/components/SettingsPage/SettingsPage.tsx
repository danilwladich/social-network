import React from "react";
import { GeneralContainer } from "./General/GeneralContainer";
import { AccountContainer } from "./Account/AccountContainer";
import "./SettingsPage.css";
import { Copyright } from "./Copyright/Copyright";
import { Messages } from "./Messages/Messages";
import { SupportContainer } from "./Support/SupportContainer";

export function SettingsPage() {
	document.title = `Settings`;
	return (
		<>
			<section className="settings">
				<div className="subsection">
					<div className="settings__items">
						<GeneralContainer />

						<Messages />

						<AccountContainer />

						<Copyright />

						<SupportContainer />
					</div>
				</div>
			</section>
		</>
	);
}
