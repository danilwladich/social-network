import React from "react";
import { NavLink } from "react-router-dom";
import { useUserImage } from "../../../../../hooks/useUserImage";
import { ProfilePostData } from "../../../../../models/Profile/ProfilePostData";
import { useDateToShow } from "../../../../../hooks/useDateToShow";
import { ProfileUserData } from "../../../../../models/Profile/ProfileUserData";
import { Actions } from "./Actions";

interface IProps {
	isAuth: boolean;
	userData: ProfileUserData;
	postData: ProfilePostData;
	buttonInProgress: boolean;
	deletePost?: () => void;
	likePost: () => void;
	unlikePost: () => void;
}

export function Header(props: IProps) {
	const postData = props.postData;
	const userData = props.userData;

	const dateToShow = useDateToShow(postData.date);

	const userImage = useUserImage(userData.image, true);

	return (
		<>
			<div className="profile__post_header">
				<NavLink
					draggable="false"
					to={"/" + userData.nickname}
					className="profile__post_header_image"
				>
					<img loading="lazy" src={userImage} alt={userData.nickname} />
				</NavLink>

				<div className="profile__post_header_name">
					<NavLink draggable="false" to={"/" + userData.nickname}>
						{userData.firstName + " " + userData.lastName}
					</NavLink>
				</div>

				<span className="profile__post_header_date">{dateToShow}</span>

				<Actions {...props} />
			</div>
		</>
	);
}
