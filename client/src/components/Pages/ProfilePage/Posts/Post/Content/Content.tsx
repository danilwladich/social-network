import React from "react";
import { ProfilePostData } from "../../../../../../models/Profile/ProfilePostData";
import { Text } from "./Text";
import { Images } from "./Images";

interface IProps {
	postData: ProfilePostData;
}

export function Content(props: IProps) {
	const postData = props.postData;

	return (
		<>
			<div className="profile__post_content">
				{!!postData.post && <Text post={postData.post} />}

				{!!postData.images?.length && (
					<Images images={postData.images} postId={postData.id} />
				)}
			</div>
		</>
	);
}
