import React from "react";
import "./NotExist.css";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

export function NotExist() {
	return (
		<>
			<Helmet>
				<title>Page not found</title>
			</Helmet>

			<div className="not-exist">
				Page does not exist
				<br />
				<NavLink to="/">Go back</NavLink>
			</div>
		</>
	);
}
