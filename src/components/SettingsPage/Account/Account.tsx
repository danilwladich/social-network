import React, { useState } from "react";
import { CloseX } from "../../assets/CloseX";
import { DeleteAccountForm } from "./DeleteAccountForm";

interface IProps {
	logoutTC: () => Promise<void>;
	deleteAccountTC: (password: string, confirmPassword: string) => Promise<void>;
}

export function Account(props: IProps) {
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
			<div className="settings__item">
				<h3 className="settings__category">Account</h3>
				<button onClick={() => props.logoutTC()} className="settings__button">
					Log Out
				</button>

				<button onClick={() => modalOn()} className="settings__button delete">
					Delete account
				</button>

				{showModal && (
					<>
						<div
							className="settings__delete_bg modal__bg"
							onClick={() => modalOff()}
						></div>
						<div className="settings__delete_modal modal">
							<h2 className="settings__delete_title title">Delete account</h2>
							<button
								className="settings__delete_close"
								onClick={() => modalOff()}
							>
								<CloseX />
							</button>
							<DeleteAccountForm
								deleteAccountTC={props.deleteAccountTC}
								modalOff={modalOff}
							/>
						</div>
					</>
				)}
			</div>
		</>
	);
}
