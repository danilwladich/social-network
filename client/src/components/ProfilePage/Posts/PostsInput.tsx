import React, { useLayoutEffect, useRef, useState } from "react";
import { Arrow } from "../../assets/Arrow";
import { CloseX } from "../../assets/CloseX";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	addPostTC: (post: string) => Promise<void>;
}

const newPostDraft: { value: string; height: string } = JSON.parse(
	sessionStorage.getItem("newPostDraft") || "{}"
);
const newPostHeight = newPostDraft.height || "50px";

export function PostsInput(props: IProps) {
	const [newPostValue, setNewPostValue] = useState(newPostDraft.value || "");
	const [addPostInProgress, setAddPostInProgress] = useState(false);
	const fieldRef = useRef<HTMLTextAreaElement>(null);

	// first render scroll bottom
	useLayoutEffect(() => {
		fieldRef.current?.scrollTo(0, fieldRef.current.scrollHeight);
	}, []);

	function updateNewPostValue(v: string) {
		if (v.length < 15000) {
			newPostDraft.value = v;

			sessionStorage.setItem("newPostDraft", JSON.stringify(newPostDraft));

			setNewPostValue(v);
		}

		if (fieldRef.current!.scrollHeight + 4 < 300) {
			fieldRef.current!.style.height = "50px";

			fieldRef.current!.style.height =
				fieldRef.current!.scrollHeight + 4 + "px";

			newPostDraft.height = fieldRef.current!.scrollHeight + 4 + "px";

			sessionStorage.setItem("newPostDraft", JSON.stringify(newPostDraft));
		}

		if (v === "") {
			newPostDraft.value = "";
			newPostDraft.height = "50px";

			sessionStorage.setItem("newPostDraft", JSON.stringify(newPostDraft));

			fieldRef.current!.style.height = "50px";
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
