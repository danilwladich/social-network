import React, { useState } from "react";
import { ProfilePostData } from "../../../models/Profile/ProfilePostData";
import { Post } from "./Post";
import { PostsInput } from "./PostsInput";

interface IProps {
	userID: string;
	profileID: string;
	postsData: ProfilePostData[];
	addPostTC: (post: string) => Promise<void>;
	likePostTC: (userID: string, postID: number) => Promise<void>;
	unlikePostTC: (userID: string, postID: number) => Promise<void>;
}

export function Posts(props: IProps) {
	const [likeButtonsInProgress, setLikeButtonsInProgress] = useState<number[]>(
		[]
	);

	function likePost(postID: number) {
		setLikeButtonsInProgress((prev) => [...prev, postID]);
		props
			.likePostTC(props.profileID, postID)
			.finally(() =>
				setLikeButtonsInProgress((prev) => prev.filter((id) => id !== postID))
			);
	}
	function unlikePost(postID: number) {
		setLikeButtonsInProgress((prev) => [...prev, postID]);
		props
			.unlikePostTC(props.profileID, postID)
			.finally(() =>
				setLikeButtonsInProgress((prev) => prev.filter((id) => id !== postID))
			);
	}

	return (
		<>
			{(!!props.postsData.length || props.userID === props.profileID) && (
				<div className="profile__posts">
					{props.userID === props.profileID && (
						<PostsInput addPostTC={props.addPostTC} />
					)}

					{props.postsData.map((p) => (
						<Post
							key={p.id}
							postData={p}
							likeButtonInProgress={likeButtonsInProgress.some(
								(id) => id === p.id
							)}
							likePost={() => likePost(p.id)}
							unlikePost={() => unlikePost(p.id)}
						/>
					))}
				</div>
			)}
		</>
	);
}
