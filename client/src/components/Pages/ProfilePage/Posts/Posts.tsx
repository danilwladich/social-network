import React, { useState } from "react";
import { ProfilePostData } from "../../../../models/Profile/ProfilePostData";
import { Post } from "./Post/Post";
import { PostsInput } from "./PostsInput";

interface IProps {
	authNickname: string;
	userNickname: string;
	firstName: string;
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
			{props.authNickname === props.userNickname && (
				<PostsInput addPostTC={props.addPostTC} />
			)}

			{!!props.postsData.length ? (
				<div className="profile__posts">
					{props.postsData.map((p) => (
						<Post
							key={p.id}
							isAuth={!!props.authNickname}
							postData={p}
							buttonInProgress={buttonsInProgress.some((id) => id === p.id)}
							deletePost={
								props.authNickname === props.userNickname
									? () => deletePost(p.id)
									: undefined
							}
							likePost={() => likePost(p.id)}
							unlikePost={() => unlikePost(p.id)}
						/>
					))}
				</div>
			) : (
				<div className="profile__posts_no_posts">
					{(props.authNickname === props.userNickname
						? "You"
						: props.firstName) + " have not added any post yet"}
				</div>
			)}
		</>
	);
}
