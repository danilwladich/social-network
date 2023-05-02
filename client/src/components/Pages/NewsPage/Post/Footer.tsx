import React from "react";
import { NewsPostData } from "../../../../models/News/NewsPostData";
import { LikeHeart } from "../../../assets/svg/LikeHeart";
import { LikesToShow } from "../../../assets/LikesToShow";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";
import { useDateToShow } from "../../../../hooks/useDateToShow";

interface IProps {
	postData: NewsPostData;
	buttonInProgress: boolean;
	likePost: () => void;
	unlikePost: () => void;
}

export function Footer(props: IProps) {
	const postData = props.postData;

	const dateToShow = useDateToShow(postData.date);

	return (
		<>
			<div className="news__post_info">
				<button
					onClick={() =>
						postData.likedMe ? props.unlikePost() : props.likePost()
					}
					disabled={props.buttonInProgress}
					className="news__post_like"
				>
					{props.buttonInProgress ? (
						<LoadingCircle />
					) : (
						<LikeHeart likedMe={postData.likedMe} />
					)}

					<LikesToShow likes={postData.likes} />
				</button>

				<span className="news__post_date">{dateToShow}</span>
			</div>
		</>
	);
}
