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
				<a
					draggable="false"
					href="mailto:frosbutte1@gmail.com"
					className="settings__button"
				>
					frosbutte1@gmail.com
				</a>
			</div>
		</>
	);
}
