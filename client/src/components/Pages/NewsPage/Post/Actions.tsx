import React, { useState } from "react";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";
import { ActionsModal } from "../../../Common/ActionsModal/ActionsModal";
import { NewsPostData } from "../../../../models/News/NewsPostData";

interface IProps {
	postData: NewsPostData;
	buttonInProgress: boolean;
	likePost: () => void;
	unlikePost: () => void;
}

export function Actions(props: IProps) {
	const [showActionsModal, setShowActionsModal] = useState(false);

	const body = document.querySelector("body");
	function modalOn() {
		body?.classList.add("lock");
		setShowActionsModal(true);
	}
	function modalOff() {
		body?.classList.remove("lock");
		setShowActionsModal(false);
	}

	function onLikeClickHandler() {
		if (props.postData.likedMe) {
			props.unlikePost();
		} else {
			props.likePost();
		}
	}

	const actions = [
		{
			text: props.postData.likedMe ? "Unlike" : "Like",
			funct: onLikeClickHandler,
		},
	];

	// return loader if button in progress
	if (props.buttonInProgress) {
		return (
			<>
				<div className="news__post_actions">
					<LoadingCircle />
				</div>
			</>
		);
	}

	return (
		<>
			<div className="news__post_actions">
				<button onClick={() => modalOn()} className="news__post_actions_show">
					<span></span>
				</button>

				{showActionsModal && (
					<ActionsModal actions={actions} hideModal={() => modalOff()} />
				)}
			</div>
		</>
	);
}
