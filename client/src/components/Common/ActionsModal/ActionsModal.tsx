import React, { useEffect } from "react";
import "./ActionsModal.css";

type Action = {
	text: string;
	funct: (...args: any[]) => any;
};

interface IProps {
	actions: Action[];
	hideModal: () => void;
}

export function ActionsModal(props: IProps) {
	const actions = props.actions;

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
			<div className="actionsModal">
				<div
					onClick={() => props.hideModal()}
					className="actionsModal__bg modal__bg"
				/>

				<div className="actionsModal__modal modal">
					<div className="actionsModal__actions">
						{actions.map((a, index) => (
							<button
								key={index}
								tabIndex={index}
								onClick={() => {
									props.hideModal();
									a.funct();
								}}
								className="actionsModal__actions_button"
							>
								{a.text}
							</button>
						))}

						<button
							tabIndex={actions.length + 1}
							onClick={() => props.hideModal()}
							className="actionsModal__actions_button cancel"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
