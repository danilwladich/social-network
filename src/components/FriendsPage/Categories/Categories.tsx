import React from "react";
import { NavLink } from "react-router-dom";

interface IProps {
	id: string;
}

export function Categories(props: IProps) {
	return (
		<>
			<div className="friends__categories">
				<NavLink
					draggable="false"
					to={"/friends/" + props.id + "/all"}
					className="friends__categories_button"
				>
					Friends
				</NavLink>
				<NavLink
					draggable="false"
					to={"/friends/" + props.id + "/followers"}
					className="friends__categories_button"
				>
					Followers
				</NavLink>
				<NavLink
					draggable="false"
					to={"/friends/" + props.id + "/followed"}
					className="friends__categories_button"
				>
					Followed
				</NavLink>
			</div>
		</>
	);
}
