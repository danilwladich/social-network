import React from "react";
import { CloseX } from "../assets/CloseX";
import "./Error.css";

interface IProps {
	errorMessage?: string;
	setErrorMessage: (v: string) => void;
}

export function Error(props: IProps) {
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
