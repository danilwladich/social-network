import React from "react";
import { ProfilePostData } from "../../../../../models/Profile/ProfilePostData";
import { Actions } from "./Actions";
import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProfileUserData } from "../../../../../models/Profile/ProfileUserData";

interface IProps {
	isAuth: boolean;
	userData: ProfileUserData;
	postData: ProfilePostData;
	buttonInProgress: boolean;
	deletePost?: () => void;
	likePost: () => void;
	unlikePost: () => void;
}

export function Post(props: IProps) {
	const postData = props.postData;
	const userData = props.userData;

	return (
		<>
			<div id={postData.id} className="profile__post">
				<Header userData={userData} postData={postData} />

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
