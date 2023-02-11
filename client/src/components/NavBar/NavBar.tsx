import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";

interface IProps {
	isAuth: boolean;
	authNickname: string;
	burger: boolean;
	countOfUnreadMessages: string[];
	setBurger: (b: boolean) => void;
}

export function NavBar(props: IProps) {
	const countOfUnreadMessages = props.countOfUnreadMessages.length;
	return (
		<>
			{props.isAuth && (
				<aside className={"navbar " + (props.burger ? "active" : "")}>
					<nav className="navbar__menu">
						<NavLink
							draggable="false"
							to={"/" + props.authNickname}
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
							className="navbar__link messages"
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
							to={"/friends/" + props.authNickname}
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
