import React from "react";
import { NewsPostData } from "../../../../models/News/NewsPostData";
import { Content } from "./Content";
import { Info } from "./Info";
import { Owner } from "./Owner";

interface IProps {
	postData: NewsPostData;
	buttonInProgress: boolean;
	bodyTheme: string;
	likePost: () => void;
	unlikePost: () => void;
}

export function Post(props: IProps) {
	const postData = props.postData;
	return (
		<>
			<div className="news__post">
				<Owner ownerData={postData.owner} bodyTheme={props.bodyTheme} />

				<Content postData={postData} />

				<Info {...props} />
			</div>
		</>
	);
}
