import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";

interface IProps {
	authNickname: string;
	burger: boolean;
	countOfUnreadMessages: string[];
	setBurger: (b: boolean) => void;
}

export function NavBar(props: IProps) {
	const countOfUnreadMessages = props.countOfUnreadMessages.length;
	const isAuth = !!props.authNickname;
	return (
		<>
			<aside className={"navbar " + (props.burger ? "active" : "")}>
				<div className="navbar__bg"></div>
				<div
					className="navbar__blur"
					onClick={() => props.setBurger(false)}
				></div>

				<nav className="navbar__menu">
					<NavLink
						draggable="false"
						to={!isAuth ? "/login" : "/" + props.authNickname}
						onClick={() => props.setBurger(false)}
						className={"navbar__link " + (!isAuth ? "notAuth" : "")}
					>
						My Profile
					</NavLink>
					<NavLink
						draggable="false"
						to={!isAuth ? "/login" : "/news"}
						onClick={() => props.setBurger(false)}
						className={"navbar__link " + (!isAuth ? "notAuth" : "")}
					>
						News
					</NavLink>
					<NavLink
						draggable="false"
						to={!isAuth ? "/login" : "/messages"}
						onClick={() => props.setBurger(false)}
						className={"navbar__link messages " + (!isAuth ? "notAuth" : "")}
					>
						Messages
						{!!countOfUnreadMessages && (
							<span className="countOfUnreadMessages">
								{countOfUnreadMessages > 9 ? "9+" : countOfUnreadMessages}
							</span>
						)}
					</NavLink>
					<NavLink
						draggable="false"
						to={!isAuth ? "/login" : "/friends/" + props.authNickname}
						onClick={() => props.setBurger(false)}
						className={"navbar__link " + (!isAuth ? "notAuth" : "")}
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
		</>
	);
}
