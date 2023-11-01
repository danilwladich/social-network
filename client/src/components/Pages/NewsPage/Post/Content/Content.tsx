import React from "react";
import { NewsPostData } from "../../../../../models/News/NewsPostData";
import { Text } from "./Text";
import { Images } from "./Images";

interface IProps {
	postData: NewsPostData;
}

export function Content(props: IProps) {
	const postData = props.postData;

	return (
		<>
			<div className="news__post_content">
				{!!postData.post && <Text post={postData.post} />}

				{!!postData.images?.length && (
					<Images images={postData.images} postId={postData.id} />
				)}
			</div>
		</>
	);
}
