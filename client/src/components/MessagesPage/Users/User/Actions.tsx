import React, { useState } from "react";
import { DeleteBin } from "../../../assets/DeleteBin";
import { LoadingCircle } from "../../../assets/LoadingCircle";

interface IProps {
	deleteButtonInProgress: boolean;
	deleteChat: () => void;
}

export function Actions(props: IProps) {
	const [confirm, setConfirm] = useState(false);
	return (
		<>
			<div className="messages__user_actions">
				<button
					onClick={() => {
						!confirm ? setConfirm(true) : props.deleteChat();
					}}
					disabled={props.deleteButtonInProgress}
					className="messages__user_actions_delete"
				>
					{props.deleteButtonInProgress ? (
						<LoadingCircle />
					) : !confirm ? (
						<DeleteBin />
					) : (
						"Confirm"
					)}
				</button>
			</div>
		</>
	);
}
