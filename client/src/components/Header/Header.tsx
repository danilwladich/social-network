import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";

interface IProps {
	isAuth: boolean;
	authNickname: string;
	headerImage: string;
	burger: boolean;
	countOfUnreadMessages: string[];
	setBurger: (b: boolean) => void;
}

export function Header(props: IProps) {
	const countOfUnreadMessages = props.countOfUnreadMessages.length;

	function scrollToTop() {
		window.requestAnimationFrame(() => {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: "smooth",
			});
		});
	}

	return (
		<>
			<header className="header">
				<nav className="header__menu">
					{props.isAuth ? (
						<NavLink
							to={"/" + props.authNickname}
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

					<button onClick={() => scrollToTop()} className="header__logo">
						<h1>
							Blo<span>xx</span>
						</h1>
					</button>

					{props.isAuth && (
						<button
							onClick={() => {
								props.burger ? props.setBurger(false) : props.setBurger(true);
							}}
							className={"header__burger " + (props.burger ? "active" : "")}
						>
							{!props.burger && !!countOfUnreadMessages && (
								<div className="countOfUnreadMessages">
									{!!countOfUnreadMessages &&
										(countOfUnreadMessages > 9 ? "9+" : countOfUnreadMessages)}
								</div>
							)}
							<span></span>
						</button>
					)}
				</nav>
			</header>
		</>
	);
}
