import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "./../../../hooks/useAppSelector";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import { setBurger } from "../../../redux/reducers/headerReducer";
import { useUserImage } from "../../../hooks/useUserImage";

export default function Header() {
	const dispatch = useAppDispatch();

	const { countOfUnreadMessages } = useAppSelector((state) => state.messages);
	const { authProfile, user: authUser } = useAppSelector((state) => state.auth);
	const { burger } = useAppSelector((state) => state.header);

	const cOUM = countOfUnreadMessages.length;

	const userImage = useUserImage(authProfile.image, true);

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
				<div className="header__container">
					<nav className="header__menu">
						{!!authUser.nickname ? (
							<NavLink
								to={"/" + authUser.nickname}
								draggable="false"
								className="header__user"
							>
								<img src={userImage} alt={authUser.nickname} />
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
							onClick={() => dispatch(setBurger(!burger))}
							className={"header__burger " + (burger ? "active" : "")}
						>
							{!burger && !!cOUM && (
								<div className="countOfUnreadMessages">
									{!!cOUM && (cOUM > 9 ? "9+" : cOUM)}
								</div>
							)}
							<span></span>
						</button>
					</nav>
				</div>
			</header>
		</>
	);
}
