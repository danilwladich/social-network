import React from "react";

export function UsersLoading() {
	const loadingElements: JSX.Element[] = [];
	for (let i = 0; i < 10; i++) {
		loadingElements.push(<UserLoading key={i} />);
	}
	return (
		<>
			<div className="messages__loading_users">{loadingElements}</div>
		</>
	);
}

function UserLoading() {
	return (
		<>
			<div className="messages__loading_user ">
				<div className="messages__loading_user_image loading_element"></div>

				<div className="messages__loading_user_info">
					<div className="messages__loading_user_name loading_element"></div>

					<div className="messages__loading_user_lastmessage">
						<div className="messages__loading_user_lastmessage_text">
							<div className="loading_element"></div>
						</div>

						<div className="messages__loading_user_lastmessage_date loading_element"></div>
					</div>
				</div>
			</div>
		</>
	);
}
