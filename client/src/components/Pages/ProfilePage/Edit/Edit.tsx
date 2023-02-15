import React, { useState } from "react";
import { ProfileUserData } from "../../../../models/Profile/ProfileUserData";
import { CloseX } from "../../../assets/CloseX";
import { EditForm } from "./EditForm";

interface IProps {
	userData: ProfileUserData;
	authNickname: string;
	editProfileTC: (
		image?: File,
		nickname?: string,
		country?: string,
		city?: string
	) => Promise<void>;
}

export function Edit(props: IProps) {
	const [showModal, setShowModal] = useState(false);

	const bodyLock = document.querySelector("body");
	function modalOn() {
		bodyLock?.classList.add("lock");
		setShowModal(true);
	}
	function modalOff() {
		bodyLock?.classList.remove("lock");
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
						<h2 className="profile__edit_title title">Edit profile </h2>
						<button className="profile__edit_close" onClick={() => modalOff()}>
							<CloseX />
						</button>
						<EditForm {...props} />
					</div>
				</>
			)}
		</>
	);
}
