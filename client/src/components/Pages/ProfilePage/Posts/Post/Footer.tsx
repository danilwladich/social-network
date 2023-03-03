import React from "react";
import { ProfilePostData } from "../../../../../models/Profile/ProfilePostData";
import { LikeHeart } from "../../../../assets/svg/LikeHeart";
import { LoadingCircle } from "../../../../assets/svg/LoadingCircle";
import { useNavigate } from "react-router-dom";
import { DateToShow } from "../../../../assets/DateToShow";
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
			<div className="profile__post_info">
				<button
					onClick={() => onLikeClickHandler()}
					disabled={props.buttonInProgress}
					className="profile__post_like"
					title={postData.likedMe ? "Unlike" : "Like"}
				>
					{props.buttonInProgress ? (
						<LoadingCircle />
					) : (
						<LikeHeart likedMe={postData.likedMe} />
					)}

					<LikesToShow likes={postData.likes} />
				</button>

				<div className="profile__post_date">
					<DateToShow date={postData.date} />
				</div>
			</div>
		</>
	);
}
