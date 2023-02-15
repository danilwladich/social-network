import React from "react";

export function Copyright() {
	return (
		<>
			<div className="settings__item">
				<h3 className="settings__category">Copyright</h3>
				<a
					draggable="false"
					href="https://github.com/danilwladich/social-network"
					className="settings__button"
				>
					GitHub
				</a>
				<p className="settings__copy">frosbutte1@gmail.com</p>
			</div>
		</>
	);
}
