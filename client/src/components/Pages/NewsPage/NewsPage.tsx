import React, { useState } from "react";
import { NewsPostData } from "../../../models/News/NewsPostData";
import { LoadingCircle } from "../../assets/LoadingCircle";
import "./NewsPage.css";
import { Post } from "./Post/Post";
import { NavLink } from "react-router-dom";

interface IProps {
	postsData: NewsPostData[];
	isLoading: boolean;
	bodyTheme: string;
	likePostTC: (postID: string) => Promise<void>;
	unlikePostTC: (postID: string) => Promise<void>;
}

export function NewsPage(props: IProps) {
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

	return (
		<>
			<section className="news">
				<div className="subsection">
					<div className="news__posts">
						{!!props.postsData.length ? (
							props.postsData.map((p) => (
								<Post
									key={p.id}
									postData={p}
									buttonInProgress={buttonsInProgress.some((id) => id === p.id)}
									bodyTheme={props.bodyTheme}
									likePost={() => likePost(p.id)}
									unlikePost={() => unlikePost(p.id)}
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
