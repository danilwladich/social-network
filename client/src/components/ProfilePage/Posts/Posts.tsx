import React, { useState } from "react";
import { ProfilePostData } from "../../../models/Profile/ProfilePostData";
import { Post } from "./Post";
import { PostsInput } from "./PostsInput";

interface IProps {
	authID: string;
	userID: string;
	postsData: ProfilePostData[];
	addPostTC: (post: string) => Promise<void>;
	deletePostTC: (postID: string) => Promise<void>;
	likePostTC: (postID: string) => Promise<void>;
	unlikePostTC: (postID: string) => Promise<void>;
}

export function Posts(props: IProps) {
	const [buttonsInProgress, setButtonsInProgress] = useState<string[]>([]);

	function likePost(postID: string) {
		setButtonsInProgress((prev) => [...prev, postID]);
		props
			.likePostTC(postID)
			.finally(() =>
				setButtonsInProgress((prev) => prev.filter((id) => id !== postID))
			);
	}
	function unlikePost(postID: string) {
		setButtonsInProgress((prev) => [...prev, postID]);
		props
			.unlikePostTC(postID)
			.finally(() =>
				setButtonsInProgress((prev) => prev.filter((id) => id !== postID))
			);
	}
	function deletePost(postID: string) {
		setButtonsInProgress((prev) => [...prev, postID]);
		props
			.deletePostTC(postID)
			.finally(() =>
				setButtonsInProgress((prev) => prev.filter((id) => id !== postID))
			);
	}

	return (
		<>
			{(!!props.postsData.length || props.authID === props.userID) && (
				<div className="profile__posts">
					{props.authID === props.userID && (
						<PostsInput addPostTC={props.addPostTC} />
					)}

					{props.postsData.map((p) => (
						<Post
							key={p.id}
							postData={p}
							buttonInProgress={buttonsInProgress.some((id) => id === p.id)}
							deletePost={
								props.authID === props.userID
									? () => deletePost(p.id)
									: undefined
							}
							likePost={() => likePost(p.id)}
							unlikePost={() => unlikePost(p.id)}
						/>
					))}
				</div>
			)}
		</>
	);
}
