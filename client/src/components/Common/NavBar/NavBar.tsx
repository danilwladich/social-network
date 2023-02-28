import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setBurger } from "../../../redux/reducers/headerReducer";

export default function NavBar() {
	const dispatch = useAppDispatch();

	const { countOfUnreadMessages } = useAppSelector((state) => state.messages);
	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);
	const { burger } = useAppSelector((state) => state.header);

	const cOUM = countOfUnreadMessages.length;

	return (
		<>
			<aside className={"navbar " + (burger ? "active" : "")}>
				<div className="navbar__bg"></div>
				<div
					className="navbar__blur"
					onClick={() => dispatch(setBurger(false))}
				/>

				<nav className="navbar__menu">
					<NavLink
						draggable="false"
						to={!authNickname ? "/login" : "/" + authNickname}
						onClick={() => dispatch(setBurger(false))}
						className={"navbar__link " + (!authNickname ? "notAuth" : "")}
					>
						My Profile
					</NavLink>
					<NavLink
						draggable="false"
						to={!authNickname ? "/login" : "/news"}
						onClick={() => dispatch(setBurger(false))}
						className={"navbar__link " + (!authNickname ? "notAuth" : "")}
					>
						News
					</NavLink>
					<NavLink
						draggable="false"
						to={!authNickname ? "/login" : "/messages"}
						onClick={() => dispatch(setBurger(false))}
						className={
							"navbar__link messages " + (!authNickname ? "notAuth" : "")
						}
					>
						Messages
						{!!cOUM && (
							<span className="countOfUnreadMessages">
								{cOUM > 9 ? "9+" : cOUM}
							</span>
						)}
					</NavLink>
					<NavLink
						draggable="false"
						to={!authNickname ? "/login" : "/friends/" + authNickname}
						onClick={() => dispatch(setBurger(false))}
						className={"navbar__link " + (!authNickname ? "notAuth" : "")}
					>
						My Friends
					</NavLink>
					<NavLink
						draggable="false"
						to="/users"
						onClick={() => dispatch(setBurger(false))}
						className="navbar__link"
					>
						Find users
					</NavLink>
					<NavLink
						draggable="false"
						to="/settings"
						onClick={() => dispatch(setBurger(false))}
						className="navbar__link"
					>
						Settings
					</NavLink>
				</nav>
			</aside>
		</>
	);
}
