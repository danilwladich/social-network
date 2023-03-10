import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

interface IProps {
	nickname: string;
	category: string;
	search?: string;
}

export function Search(props: IProps) {
	const navigate = useNavigate();
	const [searchValue, setSearchValue] = useState(
		props.search?.replaceAll("%20", " ") || ""
	);

	// go to search page when enter pressed
	useEffect(() => {
		function keyDownHandler(e: KeyboardEvent) {
			if (e.key === "Enter") {
				navigate(
					!!searchValue.trim()
						? "/friends/" +
								props.nickname +
								"/" +
								props.category +
								"?search=" +
								searchValue.trim()
						: "/friends/" + props.nickname + "/" + props.category
				);
			}
		}

		window.addEventListener("keydown", keyDownHandler);
		return () => window.removeEventListener("keydown", keyDownHandler);
	}, [searchValue, navigate, props.category, props.nickname]);

	// set search value
	function onChangeHandler(v: string) {
		if (v.length < 255 && !v.match(/[^A-Za-z ]+/g)) {
			setSearchValue(v);
		}
	}

	return (
		<>
			<div className="friends__search">
				<input
					type="text"
					value={searchValue}
					onChange={(e) => onChangeHandler(e.target.value)}
					placeholder="Who are you looking for?"
					className="friends__search_input"
				/>
				<NavLink
					to={
						!!searchValue.trim()
							? "/friends/" +
							  props.nickname +
							  "/" +
							  props.category +
							  "?search=" +
							  searchValue.trim()
							: "/friends/" + props.nickname + "/" + props.category
					}
					className="friends__search_button"
				>
					Find
				</NavLink>
			</div>
		</>
	);
}
