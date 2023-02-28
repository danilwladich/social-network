import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { addPostTC } from "../../../../redux/reducers/profileReducer";
import { Arrow } from "../../../assets/Arrow";
// import { ImageIcon } from "../../../assets/ImageIcon";
import { LoadingCircle } from "../../../assets/LoadingCircle";

const newPostDraft: { value: string; height: string } = JSON.parse(
	sessionStorage.getItem("newPostDraft") || "{}"
);
const newPostHeight = newPostDraft.height || "50px";

export function Input() {
	const dispatch = useAppDispatch();

	const [newPostValue, setNewPostValue] = useState(newPostDraft.value || "");
	const [isLoading, setIsLoading] = useState(false);

	const fieldRef = useRef<HTMLTextAreaElement>(null);
	// const postImage = useRef<HTMLImageElement>(null);

	// first render scroll bottom
	useEffect(() => {
		fieldRef.current?.scrollTo(0, fieldRef.current.scrollHeight);
	}, []);

	function updateNewPostValue(v: string) {
		if (v.length < 15000) {
			newPostDraft.value = v;

			setNewPostValue(v);
		}

		if (fieldRef.current!.scrollHeight + 4 < 285) {
			fieldRef.current!.style.height = "50px";

			fieldRef.current!.style.height =
				fieldRef.current!.scrollHeight + 4 + "px";

			newPostDraft.height = fieldRef.current!.scrollHeight + 4 + "px";
		} else {
			fieldRef.current!.style.height = "284px";

			newPostDraft.height = "284px";
		}

		if (v === "") {
			newPostDraft.value = "";
			newPostDraft.height = "50px";

			fieldRef.current!.style.height = "50px";
		}
		sessionStorage.setItem("newPostDraft", JSON.stringify(newPostDraft));
	}
	async function addPost() {
		if (newPostValue.trim() !== "") {
			setIsLoading(true);
			await dispatch(addPostTC(newPostValue));
			setIsLoading(false);
			updateNewPostValue("");
		}
	}

	// add post on enter press
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

	// function onUploadImages(e: React.ChangeEvent<HTMLInputElement>) {
	// 	const files = e.target.files;
	// 	if (files !== null) {
	// 		if (files.length > 10) {
	// 		} else {
	// 			Array.from(files).forEach((file) => {
	// 				console.log(file);
	// 			});
	// 		}
	// 	}
	// 	// if (e.target.files?.length && e.target.files[0].size <= 10000000) {
	// 	// 	const reader = new FileReader();
	// 	// 	reader.readAsDataURL(e.target.files![0]);
	// 	// 	reader.onload = function (e) {
	// 	// 		postImage.current!.src = e.target?.result as string;
	// 	// 	};
	// 	// }
	// }

	return (
		<>
			<div className="profile__posts_input">
				<textarea
					ref={fieldRef}
					disabled={isLoading}
					onKeyDown={(e) =>
						onKeyDownHandler(e, newPostValue.trim() === "" || isLoading)
					}
					onChange={(e) => updateNewPostValue(e.target.value)}
					value={newPostValue}
					placeholder="Write new post..."
					style={{ height: newPostHeight }}
					className="profile__posts_input_field"
				/>

				<button
					onClick={() => addPost()}
					disabled={newPostValue.trim() === "" || isLoading}
					className="profile__posts_input_send"
				>
					{isLoading ? <LoadingCircle /> : <Arrow id="addPostArrow" />}
				</button>

				{/* <label
					htmlFor="postImageInput"
					id="postImageInputLabel"
					className="profile__posts_input_images"
				>
					<ImageIcon />
				</label>

				<img ref={postImage} src={""} alt={""} />

				<input
					id="postImageInput"
					onChange={(e) => {
						onUploadImages(e);
					}}
					type="file"
					multiple
					accept="image/png, image/jpeg"
					style={{ display: "none" }}
				/> */}
			</div>
		</>
	);
}
