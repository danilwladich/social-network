import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";

interface IProps {
	isAuth: boolean;
	authID: string;
	headerImage: string;
	burger: boolean;
	setBurger: (b: boolean) => void;
}

export function Header(props: IProps) {
	return (
		<>
			<header className="header">
				<nav className="header__menu">
					{props.isAuth ? (
						<NavLink
							to={"/" + props.authID}
							draggable="false"
							className="header__user"
						>
							<img src={props.headerImage || "/images/user.jpg"} alt="User" />
						</NavLink>
					) : (
						<NavLink to="/login" draggable="false" className="header__login">
							login
						</NavLink>
					)}
					<div className="header__logo">
						<h1>Blo<span>xx</span></h1>
					</div>
					{props.isAuth && (
						<div
							onClick={() => {
								props.burger ? props.setBurger(false) : props.setBurger(true);
							}}
							className={"header__burger " + (props.burger ? "active" : "")}
						>
							<span></span>
						</div>
					)}
				</nav>
			</header>
		</>
	);
}
