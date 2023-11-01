import React from "react";
import { NavLink } from "react-router-dom";
import { useUserImage } from "../../../../hooks/useUserImage";
import { NewsPostData } from "../../../../models/News/NewsPostData";
import { useDateToShow } from "../../../../hooks/useDateToShow";
import { Actions } from "./Actions";

interface IProps {
	postData: NewsPostData;
	buttonInProgress: boolean;
	likePost: () => void;
	unlikePost: () => void;
}

export function Header(props: IProps) {
	const postData = props.postData;
	const ownerData = postData.owner;

	const dateToShow = useDateToShow(postData.date);

	const userImage = useUserImage(ownerData.image, true);

	return (
		<>
			<div className="news__post_header">
				<NavLink
					draggable="false"
					to={"/" + ownerData.nickname}
					className="news__post_header_image"
				>
					<img loading="lazy" src={userImage} alt={ownerData.nickname} />
				</NavLink>

				<div className="news__post_header_name">
					<NavLink draggable="false" to={"/" + ownerData.nickname}>
						{ownerData.firstName + " " + ownerData.lastName}
					</NavLink>
				</div>

				<span className="news__post_header_date">{dateToShow}</span>

				<Actions {...props} />
			</div>
		</>
	);
}
