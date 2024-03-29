import React, { useState } from "react";
import { LoadingCircle } from "../../../../assets/svg/LoadingCircle";
import { ActionsModal } from "../../../../Common/ActionsModal/ActionsModal";
import { ProfilePostData } from "../../../../../models/Profile/ProfilePostData";
import { useNavigate } from "react-router-dom";

interface IProps {
	isAuth: boolean;
	postData: ProfilePostData;
	buttonInProgress: boolean;
	deletePost?: () => void;
	likePost: () => void;
	unlikePost: () => void;
}

export function Actions(props: IProps) {
	const navigate = useNavigate();

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
		if (!props.isAuth) {
			return navigate("/login");
		}
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

	// add delete post action if its yours post
	if (props.deletePost) {
		actions.push({ text: "Delete", funct: props.deletePost });
	}

	// return loader if button in progress
	if (props.buttonInProgress) {
		return (
			<>
				<div className="profile__post_actions">
					<LoadingCircle />
				</div>
			</>
		);
	}

	return (
		<>
			<div className="profile__post_actions">
				<button
					onClick={() => modalOn()}
					className="profile__post_actions_show"
				>
					<span></span>
				</button>

				{showActionsModal && (
					<ActionsModal actions={actions} hideModal={() => modalOff()} />
				)}
			</div>
		</>
	);
}
