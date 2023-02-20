import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";

interface IProps {
	isAuth: boolean;
	authNickname: string;
	authImage?: string;
	burger: boolean;
	countOfUnreadMessages: string[];
	bodyTheme: string;
	setBurger: (b: boolean) => void;
}

export function Header(props: IProps) {
	const countOfUnreadMessages = props.countOfUnreadMessages.length;

	let userImage: string = `/images/user&theme=${props.bodyTheme}.jpg`;
	if (!!props.authImage) {
		userImage = props.authImage.split(".jpg")[0] + "&size=small.jpg";
	}

	// logo button scroll to top
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
							<img src={userImage} alt={props.authNickname} />
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
				</nav>
			</header>
		</>
	);
}
