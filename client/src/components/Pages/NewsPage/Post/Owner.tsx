import React from "react";
import { NavLink } from "react-router-dom";
import { NewsPostOwnerData } from "../../../../models/News/NewsPostOwnerData";

interface IProps {
	ownerData: NewsPostOwnerData;
	bodyTheme: string;
}

export function Owner(props: IProps) {
	const ownerData = props.ownerData;

	let userImage: string = `/images/user&theme=${props.bodyTheme}.jpg`;
	if (!!ownerData.image) {
		userImage = ownerData.image.split(".jpg")[0] + "&size=small.jpg";
	}

	return (
		<>
			<div className="news__post_owner">
				<NavLink
					draggable="false"
					to={"/" + ownerData.nickname}
					className="news__post_owner_image"
				>
					<img loading="lazy" src={userImage} alt={ownerData.nickname} />
				</NavLink>

				<div className="news__post_owner_name">
					<NavLink draggable="false" to={"/" + ownerData.nickname}>
						{ownerData.firstName + " " + ownerData.lastName}
					</NavLink>
				</div>
			</div>
		</>
	);
}
