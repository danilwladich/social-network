import React, { useState } from "react";
import { LoadingCircle } from "../../../assets/LoadingCircle";

interface IProps {
	logoutTC: () => Promise<void>;
}

export function Account(props: IProps) {
	const [buttonInProgress, setButtonInProgress] = useState(false);
	const [sure, setSure] = useState(false);

	function logout() {
		setButtonInProgress(true);
		props.logoutTC().then(() => setButtonInProgress(false));
	}
	return (
		<>
			<div className="settings__item">
				<h3 className="settings__category">Account</h3>
				<button
					disabled={buttonInProgress}
					onClick={() => {
						sure ? logout() : setSure(true);
					}}
					className="settings__button logout"
				>
					{buttonInProgress ? (
						<LoadingCircle />
					) : sure ? (
						"Are you sure?"
					) : (
						"Log Out"
					)}
				</button>
			</div>
		</>
	);
}
