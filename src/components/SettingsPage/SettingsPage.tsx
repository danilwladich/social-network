import React from "react";
import { GeneralContainer } from "./SettingsCategories/General/GeneralContainer";
import { AccountContainer } from "./SettingsCategories/Account/AccountContainer";
import "./SettingsPage.css";

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
					</div>
				</div>
			</section>
		</>
	);
}
