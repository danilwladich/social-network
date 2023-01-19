import React from "react";

export function FriendsPageLoading() {
	const loadingElements: JSX.Element[] = [];
	for (let i = 0; i < 10; i++) {
		loadingElements.push(<UserLoading key={i} />);
	}
	return (
		<section className="friends">
			<div className="subsection">
				<div className="friends__loading_title">
					<div className="friends__loading_title_image loading_element"></div>
					<div className="friends__loading_title_text loading_element"></div>
				</div>
				<div className="friends__loading_categories">
					<div className="loading_element"></div>
					<div className="loading_element"></div>
					<div className="loading_element"></div>
				</div>
				<div className="friends__loading_total loading_element"></div>
				<div className="friends__loading_items">{loadingElements}</div>
			</div>
		</section>
	);
}

function UserLoading() {
	return (
		<>
			<div className="friends__loading_item">
				<div className="friends__loading_image loading_element"></div>
				<div className="friends__loading_info">
					<div className="friends__loading_name loading_element"></div>
					<div className="friends__loading_location loading_element"></div>
				</div>
				<div className="friends__loading_actions loading_element"></div>
			</div>
		</>
	);
}
