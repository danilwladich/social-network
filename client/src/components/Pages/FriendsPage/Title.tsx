import React from "react";
import { NavLink } from "react-router-dom";
import { WhoseFriends } from "../../../models/Friends/WhoseFriends";

interface IProps {
	whoseFriends: WhoseFriends;
	bodyTheme: string;
	category: string;
}

export function Title(props: IProps) {
	const whoseFriends = props.whoseFriends;

	let userImage: string = `/images/user&theme=${props.bodyTheme}.jpg`;
	if (!!whoseFriends.image) {
		userImage = whoseFriends.image.split(".jpg")[0] + "&size=small.jpg";
	}

	return (
		<>
			<div className="friends__title title">
				<NavLink
					draggable="false"
					to={"/" + whoseFriends.nickname}
					className="friends__title_image"
				>
					<img src={userImage} alt={whoseFriends.nickname} />
				</NavLink>

				<NavLink
					draggable="false"
					to={"/" + whoseFriends.nickname}
					className="friends__title_name"
				>
					<h2>{whoseFriends.firstName + " " + whoseFriends.lastName}</h2>
				</NavLink>
			</div>
		</>
	);
}
