import React from "react";
import { NavLink } from "react-router-dom";

interface IProps {
	nickname: string;
}

export function Categories(props: IProps) {
	return (
		<>
			<div className="friends__categories">
				<NavLink
					draggable="false"
					to={"/friends/" + props.nickname + "/all"}
					className="friends__categories_button"
				>
					Friends
				</NavLink>
				<NavLink
					draggable="false"
					to={"/friends/" + props.nickname + "/followers"}
					className="friends__categories_button"
				>
					Followers
				</NavLink>
				<NavLink
					draggable="false"
					to={"/friends/" + props.nickname + "/following"}
					className="friends__categories_button"
				>
					Following
				</NavLink>
			</div>
		</>
	);
}
