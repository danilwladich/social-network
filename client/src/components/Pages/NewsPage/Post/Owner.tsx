import React from "react";
import { NavLink } from "react-router-dom";
import { useUserImage } from "../../../../hooks/useUserImage";
import { NewsPostOwnerData } from "../../../../models/News/NewsPostOwnerData";

interface IProps {
	ownerData: NewsPostOwnerData;
}

export function Owner(props: IProps) {
	const ownerData = props.ownerData;

	const userImage = useUserImage(ownerData.image, true);

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
