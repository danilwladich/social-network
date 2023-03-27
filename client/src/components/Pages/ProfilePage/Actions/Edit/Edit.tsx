import React, { useEffect, useState } from "react";
import { CloseX } from "../../../../assets/svg/CloseX";
import { EditForm } from "./EditForm";

export function Edit() {
	const [showModal, setShowModal] = useState(false);

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

	// useEffect(() => {
	// 	function beforeUnloadHandler(e: BeforeUnloadEvent) {
	// 		if (showModal) {
	// 			e.returnValue = `Are you sure you want to leave?`;
	// 		}
	// 	}

	// 	window.addEventListener("beforeunload", beforeUnloadHandler);
	// 	return () =>
	// 		window.removeEventListener("beforeunload", beforeUnloadHandler);
	// }, [showModal]);

	return (
		<>
			<button onClick={() => modalOn()} className="profile__actions_edit">
				Edit profile
			</button>

			{showModal && (
				<>
					<div
						className="profile__edit_bg modal__bg"
						onClick={() => modalOff()}
					/>

					<div className="profile__edit_modal modal">
						<div className="profile__edit_modal_header modal__header">
							<h3 className="profile__edit_modal_header_title modal__header_title">
								Edit profile
							</h3>

							<button
								className="profile__edit_close modal__header_close"
								onClick={() => modalOff()}
							>
								<CloseX />
							</button>
						</div>

						<EditForm modalOff={modalOff} />
					</div>
				</>
			)}
		</>
	);
}
