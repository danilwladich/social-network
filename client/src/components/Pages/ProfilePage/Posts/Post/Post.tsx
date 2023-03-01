import React from "react";
import { ProfilePostData } from "../../../../../models/Profile/ProfilePostData";
import { Actions } from "./Actions";
import { Content } from "./Content";
import { Footer } from "./Footer";

interface IProps {
	isAuth: boolean;
	postData: ProfilePostData;
	buttonInProgress: boolean;
	deletePost?: () => void;
	likePost: () => void;
	unlikePost: () => void;
}

export function Post(props: IProps) {
	const postData = props.postData;
	return (
		<>
			<div className="profile__post">
				<Content postData={postData} />

				<Footer {...props} />

				{!!props.deletePost && (
					<Actions
						buttonInProgress={props.buttonInProgress}
						deletePost={props.deletePost}
					/>
				)}
			</div>
		</>
	);
}
