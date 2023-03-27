import React, { useEffect, useRef } from "react";
import { Field, Form } from "react-final-form";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { addPostTC } from "../../../../../redux/reducers/profileReducer";
import { Arrow } from "../../../../assets/svg/Arrow";
import { LoadingCircle } from "../../../../assets/svg/LoadingCircle";
import { Images } from "./Images";

const newPostDraft: { value?: string; height?: string } = JSON.parse(
	sessionStorage.getItem("newPostDraft") || "{}"
);

// submit on enter press
function onKeyDownHandler(
	e: React.KeyboardEvent<HTMLSpanElement>,
	disabled: boolean,
	handleSubmit: () => Promise<any> | undefined
) {
	if (!e.shiftKey && e.key === "Enter") {
		e.preventDefault();
		if (!disabled) {
			handleSubmit();
		}
	}
}

const inputHeight = newPostDraft.height || "50px";

export function Input() {
	const dispatch = useAppDispatch();

	const inputRef = useRef<HTMLTextAreaElement>(null);

	// first render scroll bottom
	useEffect(() => {
		inputRef.current?.scrollTo(0, inputRef.current.scrollHeight);
	}, []);

	function onUpdateNewPostValue(v: string) {
		if (v.length < 15000) {
			newPostDraft.value = v;
		}

		// set input height
		if (inputRef.current !== null) {
			const ref = inputRef.current;

			if (ref.scrollHeight + 4 < 285) {
				ref.style.height = "50px";

				ref.style.height = ref.scrollHeight + 4 + "px";

				newPostDraft.height = ref.scrollHeight + 4 + "px";
			} else {
				ref.style.height = "284px";

				newPostDraft.height = "284px";
			}

			if (v === "") {
				newPostDraft.value = "";
				newPostDraft.height = "50px";

				ref.style.height = "50px";
			}

			sessionStorage.setItem("newPostDraft", JSON.stringify(newPostDraft));
		}
	}

	async function onSubmit(v: {
		post?: string;
		images?: {
			files?: FileList;
			uploadedImages?: string[];
			isLoading?: boolean;
		};
	}) {
		const post = v.post?.trim() || newPostDraft.value || undefined;
		const images = v.images?.files?.length ? v.images.files : undefined;
		const uploadedImages = v.images?.uploadedImages?.length
			? v.images.uploadedImages
			: undefined;

		const { meta } = await dispatch(
			addPostTC({ post, images, uploadedImages })
		);

		if (meta.requestStatus === "fulfilled") {
			if (post) {
				onUpdateNewPostValue("");
			}
		}
	}
	function validate(e: {
		post?: string;
		images?: {
			files?: FileList;
			uploadedImages?: string[];
			isLoading?: boolean;
		};
	}) {
		const errors: { post?: string; images?: string } = {};
		// post
		if (e.post && e.post.length > 15000) {
			errors.post = "Too long";
		}

		// images
		if (e.images && e.images.files?.length) {
			if (
				!Array.from(e.images.files).every(
					(file) => file.type.split("/")[0] === "image"
				)
			) {
				errors.images = "Only images allowed";
			}
			if (
				!Array.from(e.images.files).every(
					(file) => file.size <= 10 * 1024 * 1024
				)
			) {
				errors.images = "File size cannot be more than 10mb";
			}
			if (e.images.files.length > 10) {
				errors.images = "Max allowed 10 files";
			}
		}

		return errors;
	}

	// TODO bug with form initial value newPostDraft.value

	return (
		<>
			<Form
				onSubmit={onSubmit}
				validate={validate}
				render={({
					handleSubmit,
					submitting,
					form,
					values,
					hasValidationErrors,
				}) => (
					<form className="profile__posts_input">
						<Field
							name="post"
							render={({ input: { value, onChange, ...input } }) => (
								<textarea
									{...input}
									ref={inputRef}
									disabled={submitting}
									onKeyDown={(e) =>
										onKeyDownHandler(
											e,
											!(values.post?.trim() || values.images?.files?.length) ||
												values.images?.isLoading ||
												submitting ||
												hasValidationErrors,
											() => handleSubmit(e)?.then(form.reset)
										)
									}
									onChange={(e) => {
										onUpdateNewPostValue(e.target.value);
										onChange(e);
									}}
									value={value.slice(0, 15000)}
									placeholder="Write new post..."
									style={{ height: inputHeight }}
									className="profile__posts_input_field"
								/>
							)}
						/>

						<Field name="images" render={(props) => <Images {...props} />} />

						<button
							type="submit"
							onClick={(e) => handleSubmit(e)?.then(form.reset)}
							disabled={
								!(values.post?.trim() || values.images?.files?.length) ||
								values.images?.isLoading ||
								submitting ||
								hasValidationErrors
							}
							className="profile__posts_input_send"
						>
							{submitting ? <LoadingCircle /> : <Arrow rotate="90deg" />}
						</button>
					</form>
				)}
			/>
		</>
	);
}
