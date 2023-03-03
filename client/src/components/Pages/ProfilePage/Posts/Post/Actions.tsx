import React, { useState } from "react";
import { DeleteBin } from "../../../../assets/svg/DeleteBin";
import { LoadingCircle } from "../../../../assets/svg/LoadingCircle";
import { SubmitModal } from "../../../../Common/SubmitModal/SubmitModal";

interface IProps {
	buttonInProgress: boolean;
	deletePost: () => void;
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
					onClick={() => modalOn()}
					disabled={props.buttonInProgress}
					className={
						"profile__post_actions_delete " + (showActions ? "active" : "")
					}
				>
					{props.buttonInProgress ? <LoadingCircle /> : <DeleteBin />}
				</button>

				{showSubmitModal && (
					<SubmitModal
						text="Post will be permanently deleted"
						funct={() => props.deletePost()}
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
