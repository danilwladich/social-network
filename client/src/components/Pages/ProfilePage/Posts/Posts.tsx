import React, { useState } from "react";
import { Post } from "./Post/Post";
import { Input } from "./Input/Input";
import { useAppSelector } from "./../../../../hooks/useAppSelector";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import {
	deletePostTC,
	likePostTC,
	unlikePostTC,
} from "../../../../redux/reducers/profileReducer";

export function Posts() {
	const dispatch = useAppDispatch();

	const [buttonsInProgress, setButtonsInProgress] = useState<string[]>([]);

	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);
	const { postsData, userData } = useAppSelector((state) => state.profile);

	async function likePost(postID: string) {
		setButtonsInProgress((prev) => [...prev, postID]);
		await dispatch(likePostTC(postID));
		setButtonsInProgress((prev) => prev.filter((id) => id !== postID));
	}
	async function unlikePost(postID: string) {
		setButtonsInProgress((prev) => [...prev, postID]);
		await dispatch(unlikePostTC(postID));
		setButtonsInProgress((prev) => prev.filter((id) => id !== postID));
	}
	async function deletePost(postID: string) {
		setButtonsInProgress((prev) => [...prev, postID]);
		await dispatch(deletePostTC(postID));
		setButtonsInProgress((prev) => prev.filter((id) => id !== postID));
	}

	return (
		<>
			<div className="subsection">
				{authNickname === userData.nickname && <Input />}
			</div>

			<div className="subsection">
				{!!postsData.length ? (
					<div className="profile__posts">
						{postsData.map((p) => (
							<Post
								key={p.id}
								isAuth={!!authNickname}
								userData={userData}
								postData={p}
								buttonInProgress={buttonsInProgress.some((id) => id === p.id)}
								deletePost={
									authNickname === userData.nickname
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
						{`${
							authNickname === userData.nickname ? "You" : userData.firstName
						} have not added any post yet`}
					</div>
				)}
			</div>
		</>
	);
}
