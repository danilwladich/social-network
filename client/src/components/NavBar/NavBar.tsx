import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";

interface IProps {
	isAuth: boolean;
	authID: string;
	burger: boolean;
	setBurger: (b: boolean) => void;
}

export function NavBar(props: IProps) {
	return (
		<>
			{props.isAuth && (
				<aside className={"navbar " + (props.burger ? "active" : "")}>
					<nav className={"navbar__menu " + (props.burger ? "active" : "")}>
						<NavLink
							draggable="false"
							to={"/" + props.authID}
							onClick={() => props.setBurger(false)}
							className="navbar__link"
						>
							My Profile
						</NavLink>
						<NavLink
							draggable="false"
							to="/news"
							onClick={() => props.setBurger(false)}
							className="navbar__link"
						>
							News
						</NavLink>
						<NavLink
							draggable="false"
							to="/messages"
							onClick={() => props.setBurger(false)}
							className="navbar__link"
						>
							Messages
						</NavLink>
						<NavLink
							draggable="false"
							to={"/friends/" + props.authID}
							onClick={() => props.setBurger(false)}
							className="navbar__link"
						>
							My Friends
						</NavLink>
						<NavLink
							draggable="false"
							to="/users"
							onClick={() => props.setBurger(false)}
							className="navbar__link"
						>
							Find users
						</NavLink>
						<NavLink
							draggable="false"
							to="/settings"
							onClick={() => props.setBurger(false)}
							className="navbar__link"
						>
							Settings
						</NavLink>
					</nav>
				</aside>
			)}
		</>
	);
}
