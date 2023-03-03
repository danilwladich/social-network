import React, { useEffect, useState } from "react";
import { CloseX } from "../../../assets/svg/CloseX";
import { DeleteAccountForm } from "./DeleteAccountForm";
import { useNavigate } from "react-router-dom";
import { socket } from "./../../../../App";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { logoutTC } from "../../../../redux/reducers/authReducer";

export function Account() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);

	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);

	const body = document.querySelector("body");
	function modalOn() {
		body?.classList.add("lock");
		setShowModal(true);
	}
	function modalOff() {
		body?.classList.remove("lock");
		setShowModal(false);
	}

	async function logout() {
		const { meta } = await dispatch(logoutTC());

		if (meta.requestStatus === "fulfilled") {
			navigate("/login");
			socket.emit("logout", { nickname: authNickname });
		}
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
			<div className="settings__item">
				<h3 className="settings__category">Account</h3>
				<button onClick={() => logout()} className="settings__button">
					Log Out
				</button>

				<button onClick={() => modalOn()} className="settings__button">
					Delete account
				</button>

				{showModal && (
					<>
						<div
							className="settings__delete_bg modal__bg"
							onClick={() => modalOff()}
						></div>

						<div className="settings__delete_modal modal">
							<h3 className="settings__delete_title title">Delete account</h3>

							<button
								className="settings__delete_close"
								onClick={() => modalOff()}
							>
								<CloseX />
							</button>

							<DeleteAccountForm />
						</div>
					</>
				)}
			</div>
		</>
	);
}
