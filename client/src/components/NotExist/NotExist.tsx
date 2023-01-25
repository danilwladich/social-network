import React from "react";
import "./NotExist.css";
import { NavLink } from "react-router-dom";

export function NotExist() {
	document.title = `Page not found`;
	return (
		<>
			<div className="not-exist">
				Page does not exist
				<br />
				<NavLink to="/">Go back</NavLink>
			</div>
		</>
	);
}
