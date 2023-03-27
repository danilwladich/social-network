import React, { useEffect, useState } from "react";
import { useUserImage } from "../../../../hooks/useUserImage";
import { CloseX } from "../../../assets/svg/CloseX";
import { useAppSelector } from "./../../../../hooks/useAppSelector";
import { EditPen } from "./../../../assets/svg/EditPen";
import { CoverForm } from "./CoverForm";

export function Cover() {
	const [showModal, setShowModal] = useState(false);

	const { cover, image, nickname } = useAppSelector(
		(state) => state.profile.userData
	);
	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);

	const isOwner = nickname === authNickname;

	const userImage = useUserImage(image, true);

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
			<div className="profile__cover">
				<img
					src={cover || userImage}
					className={!cover ? "blur" : ""}
					alt={nickname + " cover"}
				/>

				{isOwner && (
					<>
						<button
							onClick={() => modalOn()}
							className="profile__cover_action"
							title="Update cover"
						>
							<EditPen />
						</button>

						{showModal && (
							<>
								<div
									onClick={() => modalOff()}
									className="profile__cover_modal__bg modal__bg"
								/>
								<div className="profile__cover_modal modal">
									<div className="profile__cover_modal_header modal__header">
										<h3 className="profile__cover_modal_header_title modal__header_title">
											Update cover
										</h3>

										<button
											className="profile__cover_modal_header_close  modal__header_close"
											onClick={() => modalOff()}
										>
											<CloseX />
										</button>
									</div>

									<CoverForm
										authNickname={authNickname}
										cover={cover}
										userImage={userImage}
										modalOff={modalOff}
									/>
								</div>
							</>
						)}
					</>
				)}
			</div>
		</>
	);
}
