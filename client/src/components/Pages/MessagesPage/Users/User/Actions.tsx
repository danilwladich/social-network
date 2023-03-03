import React, { useState } from "react";
import { DeleteBin } from "../../../../assets/svg/DeleteBin";
import { LoadingCircle } from "../../../../assets/svg/LoadingCircle";
import { SubmitModal } from "../../../../Common/SubmitModal/SubmitModal";

interface IProps {
	firstName: string;
	deleteButtonInProgress: boolean;
	deleteChat: () => void;
}

export function Actions(props: IProps) {
	const [showActions, setShowActions] = useState(false);
	const [showSubmitModal, setShowSubmitModal] = useState(false);

	const body = document.querySelector("body");
	function modalOn() {
		body?.classList.add("lock");
		setShowSubmitModal(true);
	}
	function modalOff() {
		body?.classList.remove("lock");
		setShowSubmitModal(false);
	}

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
					onClick={() => modalOn()}
					disabled={props.deleteButtonInProgress}
					className={
						"messages__user_actions_delete " +
						(showActions || showSubmitModal ? "active" : "")
					}
				>
					{props.deleteButtonInProgress ? <LoadingCircle /> : <DeleteBin />}
				</button>

				{showSubmitModal && (
					<SubmitModal
						text={
							"Chat will be permanently deleted for you and " + props.firstName
						}
						funct={() => props.deleteChat()}
						hideModal={() => {
							setShowActions(false);
							modalOff();
						}}
					/>
				)}
			</div>
		</>
	);
}
