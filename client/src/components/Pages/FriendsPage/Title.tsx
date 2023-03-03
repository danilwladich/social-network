import React from "react";
import { NavLink } from "react-router-dom";
import { useUserImage } from "../../../hooks/useUserImage";
import { WhoseFriends } from "../../../models/Friends/WhoseFriends";

interface IProps {
	whoseFriends: WhoseFriends;
	category: string;
}

export function Title(props: IProps) {
	const whoseFriends = props.whoseFriends;

	const userImage = useUserImage(whoseFriends.image, true);

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
