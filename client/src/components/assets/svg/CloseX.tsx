import React from "react";

export function CloseX() {
	return (
		<>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="closeX"
			>
				<path
					d="M18 6L6 18"
					strokeWidth="2"
					strokeLinecap="square"
					strokeLinejoin="round"
				></path>{" "}
				<path
					d="M6 6L18 18"
					strokeWidth="2"
					strokeLinecap="square"
					strokeLinejoin="round"
				></path>{" "}
			</svg>
		</>
	);
}
