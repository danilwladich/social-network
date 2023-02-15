import React, { useState } from "react";
import { DeleteBin } from "../../../../assets/DeleteBin";
import { LoadingCircle } from "../../../../assets/LoadingCircle";

interface IProps {
	deleteButtonInProgress: boolean;
	deleteChat: () => void;
}

export function Actions(props: IProps) {
	const [showActions, setShowActions] = useState(false);
	const [confirm, setConfirm] = useState(false);
	return (
		<>
			<div
				onMouseEnter={() => setShowActions(true)}
				onMouseLeave={() => setShowActions(false)}
				className="messages__user_actions"
			>
				<button
					onClick={() => {
						showActions ? setShowActions(false) : setShowActions(true);
					}}
					className="messages__user_actions_show"
				>
					<span></span>
				</button>

				<button
					onClick={() => {
						!confirm ? setConfirm(true) : props.deleteChat();
					}}
					disabled={props.deleteButtonInProgress}
					className={
						"messages__user_actions_delete " + (showActions ? "active" : "")
					}
				>
					{props.deleteButtonInProgress ? (
						<LoadingCircle />
					) : !confirm ? (
						<DeleteBin />
					) : (
						"Confirm \n delete"
					)}
				</button>
			</div>
		</>
	);
}
