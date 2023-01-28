import React, { useEffect } from "react";
import { socket } from "../../App";
import { CloseX } from "../assets/CloseX";
import "./Error.css";

interface IProps {
	errorMessage?: string;
	setErrorMessage: (v: string) => void;
}

export function Error(props: IProps) {
	useEffect(() => {
		socket.on("error", (data) => {
			props.setErrorMessage(data.statusText);
		});

		return () => {
			socket.off("error").off();
		};
		// eslint-disable-next-line
	}, []);

	return (
		<>
			{props.errorMessage && (
				<div className="error">
					<span className="error__message">{props.errorMessage}</span>
					<button
						onClick={() => props.setErrorMessage("")}
						className="error__close"
					>
						<CloseX />
					</button>
				</div>
			)}
		</>
	);
}