import React from "react";

export function UsersPageLoading() {
	const loadingElements: JSX.Element[] = [];
	for (let i = 0; i < 10; i++) {
		loadingElements.push(<UserLoading key={i} />);
	}
	return (
		<section className="users">
			<div className="subsection">
				<div className="users__loading_search loading_element"></div>
			</div>
			<div className="subsection">
				<div className="users__loading_items">{loadingElements}</div>
			</div>
		</section>
	);
}

function UserLoading() {
	return (
		<>
			<div className="users__loading_item">
				<div className="users__loading_image loading_element"></div>
				<div className="users__loading_info">
					<div className="users__loading_name loading_element"></div>
					<div className="users__loading_location loading_element"></div>
				</div>
				<div className="users__loading_actions loading_element"></div>
			</div>
		</>
	);
}
