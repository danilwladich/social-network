import React, { useEffect } from "react";
import "./SubmitModal.css";

interface IProps {
	text: string;
	funct: (...args: any[]) => any;
	hideModal: () => void;
}

export function SubmitModal(props: IProps) {
	const isDelete = props.text.includes("delete");

	// hide modal on esc press
	useEffect(() => {
		function keyDownHandler(e: KeyboardEvent) {
			if (e.key === "Escape") {
				props.hideModal();
			}
		}

		window.addEventListener("keydown", keyDownHandler);
		return () => window.removeEventListener("keydown", keyDownHandler);
	}, [props]);

	return (
		<>
			<div className="submitModal">
				<div
					onClick={() => props.hideModal()}
					className="submitModal__bg modal__bg"
				/>

				<div className="submitModal__modal modal">
					<div className="submitModal__text">{props.text}</div>

					<button
						tabIndex={1}
						onClick={() => {
							props.hideModal();
							props.funct();
						}}
						className={
							"submitModal__button " + (isDelete ? "delete" : "submit")
						}
					>
						{isDelete ? "Delete" : "Confirm"}
					</button>

					<button
						tabIndex={2}
						onClick={() => props.hideModal()}
						className="submitModal__button cancel"
					>
						Cancel
					</button>
				</div>
			</div>
		</>
	);
}
