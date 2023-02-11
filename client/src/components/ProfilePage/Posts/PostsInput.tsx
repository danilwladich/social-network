import React, { useEffect, useRef, useState } from "react";
import { Arrow } from "../../assets/Arrow";
import { CloseX } from "../../assets/CloseX";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	addPostTC: (post: string) => Promise<void>;
}

export function PostsInput(props: IProps) {
	const [newPostValue, setNewPostValue] = useState(
		sessionStorage.getItem("newPostDraft") || ""
	);
	const [addPostInProgress, setAddPostInProgress] = useState(false);
	const newPostHeight = sessionStorage.getItem("newPostDraftHeight") || "50px";
	const fieldRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		fieldRef.current?.scrollTo(0, fieldRef.current.scrollHeight);
	}, []);

	function updateNewPostValue(v: string) {
		if (v.length < 15000) {
			sessionStorage.setItem("newPostDraft", v);
			setNewPostValue(v);
		}
		if (fieldRef.current!.scrollHeight + 4 < 300) {
			fieldRef.current!.style.height = "50px";
			fieldRef.current!.style.height =
				fieldRef.current!.scrollHeight + 4 + "px";
			sessionStorage.setItem(
				"newPostDraftHeight",
				fieldRef.current!.scrollHeight + 4 + "px"
			);
		}
		if (v === "") {
			fieldRef.current!.style.height = "50px";
			sessionStorage.setItem("newPostDraftHeight", "50px");
		}
	}
	function addPost() {
		setAddPostInProgress(true);
		updateNewPostValue("");
		if (newPostValue.trim() !== "") {
			props.addPostTC(newPostValue).finally(() => setAddPostInProgress(false));
		}
	}
	function onKeyDownHandler(
		e: React.KeyboardEvent<HTMLSpanElement>,
		disabled: boolean
	) {
		if (!e.shiftKey && e.key === "Enter") {
			e.preventDefault();
			if (!disabled) {
				addPost();
			}
		}
	}

	return (
		<>
			<div className="profile__posts_input">
				<textarea
					ref={fieldRef}
					disabled={addPostInProgress}
					onKeyDown={(e) =>
						onKeyDownHandler(e, newPostValue.trim() === "" || addPostInProgress)
					}
					onChange={(e) => updateNewPostValue(e.target.value)}
					value={newPostValue}
					placeholder="Write new post..."
					style={{ height: newPostHeight }}
					className="profile__posts_input_field"
				/>

				<button
					onClick={() => addPost()}
					disabled={newPostValue.trim() === "" || addPostInProgress}
					className="profile__posts_input_send"
				>
					{addPostInProgress ? <LoadingCircle /> : <Arrow id="addPostArrow" />}
				</button>

				{newPostValue && (
					<button
						onClick={() => {
							updateNewPostValue("");
						}}
						className="profile__posts_input_cancel"
					>
						<CloseX />
					</button>
				)}
			</div>
		</>
	);
}
