import React from "react";
import { GeneralContainer } from "./General/GeneralContainer";
import { AccountContainer } from "./Account/AccountContainer";
import "./SettingsPage.css";
import { Copyright } from "./Copyright/Copyright";

export function SettingsPage() {
	document.title = `Settings`;
	return (
		<>
			<section className="settings">
				<div className="subsection">
					<h2 className="settings__title title">Settings</h2>
					<div className="settings__items">
						<GeneralContainer />

						<AccountContainer />

						<Copyright />
					</div>
				</div>
			</section>
		</>
	);
}
