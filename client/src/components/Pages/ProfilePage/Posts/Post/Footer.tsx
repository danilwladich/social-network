import React from "react";
import { ProfilePostData } from "../../../../../models/Profile/ProfilePostData";
import { LikeHeart } from "../../../../assets/svg/LikeHeart";
import { useNavigate } from "react-router-dom";
import { LikesToShow } from "../../../../assets/LikesToShow";

interface IProps {
	isAuth: boolean;
	postData: ProfilePostData;
	buttonInProgress: boolean;
	likePost: () => void;
	unlikePost: () => void;
}

export function Footer(props: IProps) {
	const navigate = useNavigate();

	const postData = props.postData;

	function onLikeClickHandler() {
		if (!props.isAuth) {
			return navigate("/login");
		}
		if (postData.likedMe) {
			props.unlikePost();
		} else {
			props.likePost();
		}
	}

	return (
		<>
			<div className="profile__post_footer_info">
				<button
					onClick={() => onLikeClickHandler()}
					disabled={props.buttonInProgress}
					className="profile__post_footer_like"
				>
					<LikeHeart likedMe={postData.likedMe} />

					<LikesToShow likes={postData.likes} />
				</button>
			</div>
		</>
	);
}
