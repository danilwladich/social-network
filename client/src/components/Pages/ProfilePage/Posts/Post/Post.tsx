import React from "react";
import { ProfilePostData } from "../../../../../models/Profile/ProfilePostData";
import { Content } from "./Content/Content";
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

	return (
		<>
			<div className="profile__post">
				<Header {...props} />

				<Content postData={postData} />

				<Footer {...props} />
			</div>
		</>
	);
}
