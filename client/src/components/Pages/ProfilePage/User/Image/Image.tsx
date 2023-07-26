import React, { useEffect, useState } from "react";
import { useUserImage } from "../../../../../hooks/useUserImage";
import { ProfileUserData } from "../../../../../models/Profile/ProfileUserData";
import { EditPen } from "../../../../assets/svg/EditPen";
import { UserOnline } from "../../../../assets/UserOnline";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { CloseX } from "../../../../assets/svg/CloseX";
import { ImageForm } from "./ImageForm";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { setImages } from "../../../../../redux/reducers/imagesReducer";

interface IProps {
	userData: ProfileUserData;
}

export function Image(props: IProps) {
	const dispatch = useAppDispatch();

	const [showAction, setShowAction] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);

	const userData = props.userData;

	const userImage = useUserImage(userData.image);

	const isOwner = authNickname === userData.nickname;

	const body = document.querySelector("body");
	function modalOn() {
		body?.classList.add("lock");
		setShowModal(true);
	}
	function modalOff() {
		body?.classList.remove("lock");
		setShowModal(false);
	}

	// modal off on esc press
	useEffect(() => {
		function modalOff() {
			body?.classList.remove("lock");
			setShowModal(false);
		}

		function keyDownHandler(e: KeyboardEvent) {
			if (e.key === "Escape") {
				modalOff();
			}
		}

		window.addEventListener("keydown", keyDownHandler);
		return () => window.removeEventListener("keydown", keyDownHandler);
	}, [body]);

	return (
		<>
			<div
				onMouseEnter={() => setShowAction(true)}
				onMouseLeave={() => setShowAction(false)}
				className="profile__user_image"
			>
				<img src={userImage} alt={userData.nickname} />
				{isOwner && (
					<button
						onClick={() => {
							modalOn();
							setShowAction(false);
						}}
						className={
							"profile__user_image_action " + (showAction ? "active" : "")
						}
					>
						<EditPen />
					</button>
				)}

				{!isOwner && (
					<button
						onClick={() =>
							dispatch(setImages({ images: userImage.split(" ") }))
						}
						className="profile__user_image_setimage"
					/>
				)}

				<UserOnline online={userData.online} className="profile__user_online" />
			</div>

			{isOwner && showModal && (
				<>
					<div
						onClick={() => modalOff()}
						className="profile__user_image_modal__bg modal__bg"
					/>
					<div className="profile__user_image_modal modal">
						<div className="profile__user_image_modal_header modal__header">
							<h3 className="profile__user_image_modal_title modal__header_title">
								Update image
							</h3>

							<button
								className="profile__user_image_modal_close modal__header_close"
								onClick={() => modalOff()}
							>
								<CloseX />
							</button>
						</div>

						<ImageForm
							authNickname={authNickname}
							userImage={userImage}
							modalOff={modalOff}
						/>
					</div>
				</>
			)}
		</>
	);
}
