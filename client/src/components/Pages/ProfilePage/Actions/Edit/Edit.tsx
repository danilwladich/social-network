import React, { useState } from "react";
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
					></div>

					<div className="profile__edit_modal modal">
						<h3 className="profile__edit_title title">Edit profile</h3>

						<button className="profile__edit_close" onClick={() => modalOff()}>
							<CloseX />
						</button>

						<EditForm modalOff={modalOff} />
					</div>
				</>
			)}
		</>
	);
}
