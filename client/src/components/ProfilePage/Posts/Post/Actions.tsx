import React, { useState } from "react";
import { LoadingCircle } from "../../../assets/LoadingCircle";

interface IProps {
	buttonInProgress: boolean;
	deletePost: () => void;
}

export function Actions(props: IProps) {
	const [showActions, setShowActions] = useState(false);
	const [confirm, setConfirm] = useState(false);
	return (
		<>
			<div
				onMouseEnter={() => setShowActions(true)}
				onMouseLeave={() => setShowActions(false)}
				className="profile__post_actions"
			>
				<button
					onClick={() => {
						showActions ? setShowActions(false) : setShowActions(true);
					}}
					className="profile__post_actions_show"
				>
					<span></span>
				</button>

				<button
					onClick={() => {
						!confirm ? setConfirm(true) : props.deletePost();
					}}
					disabled={props.buttonInProgress}
					className={
						"profile__post_actions_delete " + (showActions ? "active" : "")
					}
				>
					{props.buttonInProgress ? (
						<LoadingCircle />
					) : !confirm ? (
						"Delete post"
					) : (
						"Confirm"
					)}
				</button>
			</div>
		</>
	);
}
