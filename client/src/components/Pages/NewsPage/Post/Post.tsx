import React from "react";
import { NewsPostData } from "../../../../models/News/NewsPostData";
import { Content } from "./Content";
import { Footer } from "./Footer";
import { Owner } from "./Owner";

interface IProps {
	postData: NewsPostData;
	buttonInProgress: boolean;
	likePost: () => void;
	unlikePost: () => void;
}

export function Post(props: IProps) {
	const postData = props.postData;
	return (
		<>
			<div className="news__post">
				<Owner ownerData={postData.owner}/>

				<Content postData={postData} />

				<Footer {...props} />
			</div>
		</>
	);
}
