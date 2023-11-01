import React, { useState } from "react";
import "./NewsPage.css";
import { LoadingCircle } from "../../assets/svg/LoadingCircle";
import { Post } from "./Post/Post";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAppSelector } from "./../../../hooks/useAppSelector";
import { useAppDispatch } from "./../../../hooks/useAppDispatch";
import { likePostTC, unlikePostTC } from "../../../redux/reducers/newsReducer";

interface IProps {
	isLoading: boolean;
}

export function NewsPage(props: IProps) {
	const dispatch = useAppDispatch();

	const [buttonsInProgress, setButtonsInProgress] = useState<string[]>([]);

	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);
	const { postsData } = useAppSelector((state) => state.news);

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

	return (
		<>
			<Helmet>
				<title>News</title>
			</Helmet>

			<section className="news">
				<div className="subsection">
					<div className="news__posts">
						{!!postsData.length ? (
							postsData.map((post) => (
								<Post
									key={post.id}
									isAuth={!!authNickname}
									postData={post}
									buttonInProgress={buttonsInProgress.some(
										(id) => id === post.id
									)}
									likePost={() => likePost(post.id)}
									unlikePost={() => unlikePost(post.id)}
								/>
							))
						) : (
							<div className="news__posts_no_posts">
								All your following have not added any post yet <br />{" "}
								<NavLink to="/users">You can find some new friends</NavLink>
							</div>
						)}
					</div>

					{props.isLoading && (
						<div className="news__posts_loading">
							<LoadingCircle />
						</div>
					)}
				</div>
			</section>
		</>
	);
}
