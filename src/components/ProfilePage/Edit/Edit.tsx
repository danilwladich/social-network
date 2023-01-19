import React, { useState } from "react";
import { CloseX } from "../../assets/CloseX";
import { EditForm } from "./EditForm";

interface IProps {
	authID: string;
	image?: string;
	editProfileTC: (
		image?: File,
		id?: string,
		country?: string,
		city?: string
	) => Promise<void>;
}

export function Edit(props: IProps) {
	const [editMode, setEditMode] = useState(false);

	const bodyLock = document.querySelector("body");
	function editModeOn() {
		bodyLock?.classList.add("lock");
		setEditMode(true);
	}
	function editModeOff() {
		bodyLock?.classList.remove("lock");
		setEditMode(false);
	}
	return (
		<>
			<button onClick={() => editModeOn()} className="profile__actions_edit">
				Edit profile
			</button>
			{editMode && (
				<>
					<div className="profile__edit_bg" onClick={() => editModeOff()}></div>
					<div className="profile__edit_modal">
						<h2 className="profile__edit_title">Edit profile </h2>
						<button
							className="profile__edit_close"
							onClick={() => editModeOff()}
						>
							<CloseX />
						</button>
						<EditForm {...props} editModeOff={editModeOff} />
					</div>
				</>
			)}
		</>
	);
}
