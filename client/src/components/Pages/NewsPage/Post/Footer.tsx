import React from "react";
import { NewsPostData } from "../../../../models/News/NewsPostData";
import { DateToShow } from "../../../assets/DateToShow";
import { LikeHeart } from "../../../assets/svg/LikeHeart";
import { LikesToShow } from "../../../assets/LikesToShow";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";

interface IProps {
	postData: NewsPostData;
	buttonInProgress: boolean;
	likePost: () => void;
	unlikePost: () => void;
}

export function Footer(props: IProps) {
	const postData = props.postData;
	return (
		<>
			<div className="news__post_info">
				<button
					onClick={() =>
						postData.likedMe ? props.unlikePost() : props.likePost()
					}
					disabled={props.buttonInProgress}
					className="news__post_like"
					title={postData.likedMe ? "Unlike" : "Like"}
				>
					{props.buttonInProgress ? (
						<LoadingCircle />
					) : (
						<LikeHeart likedMe={postData.likedMe} />
					)}

					<LikesToShow likes={postData.likes} />
				</button>

				<div className="news__post_date">
					<DateToShow date={postData.date} />
				</div>
			</div>
		</>
	);
}
