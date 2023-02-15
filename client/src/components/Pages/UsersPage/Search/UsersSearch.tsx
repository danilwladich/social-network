import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

interface IProps {
	search?: string;
}

export function UsersSearch(props: IProps) {
	const navigate = useNavigate();
	const [searchValue, setSearchValue] = useState(
		props.search?.replaceAll("%20", " ") || ""
	);

	// go to search page when enter pressed
	useEffect(() => {
		window.addEventListener("keydown", keyDownHandler);
		return () => {
			window.removeEventListener("keydown", keyDownHandler);
		};
		// eslint-disable-next-line
	}, [searchValue]);
	function keyDownHandler(e: KeyboardEvent) {
		if (e.key === "Enter") {
			navigate(
				!!searchValue.trim() ? "/users?search=" + searchValue.trim() : "/users"
			);
		}
	}

	// set search value
	function onChangeHandler(v: string) {
		if (v.length < 255 && !v.match(/[^A-Za-z ]+/g)) {
			setSearchValue(v);
		}
	}

	return (
		<>
			<div className="users__search">
				<input
					type="text"
					value={searchValue}
					autoFocus
					tabIndex={1}
					onChange={(e) => onChangeHandler(e.target.value)}
					placeholder="Who are you looking for?"
					className="users__search_input"
				/>
				<NavLink
					to={
						!!searchValue.trim()
							? "/users?search=" + searchValue.trim()
							: "/users"
					}
					className="users__search_button"
				>
					Find
				</NavLink>
			</div>
		</>
	);
}
