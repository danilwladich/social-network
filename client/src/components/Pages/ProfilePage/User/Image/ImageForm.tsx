import React, { useRef, useState } from "react";
import { Field, Form } from "react-final-form";
import { LoadingCircle } from "../../../../assets/svg/LoadingCircle";
import { useAppDispatch } from "./../../../../../hooks/useAppDispatch";
import { editProfileImageTC } from "../../../../../redux/reducers/profileReducer";

interface IProps {
	authNickname: string;
	userImage: string;
	modalOff: () => void;
}

export function ImageForm(props: IProps) {
	const dispatch = useAppDispatch();

	const newImageRef = useRef<HTMLImageElement>(null);

	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	function onUpdateProfileImage(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files?.length && e.target.files[0].size <= 10 * 1024 * 1024) {
			const reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = function (e) {
				newImageRef.current!.src = e.target?.result as string;
			};
		}
	}
	async function onSubmit(v: { image?: FileList }) {
		setSubmitting(true);

		if (v.image) {
			const image = v.image[0];

			const { meta, payload } = await dispatch(editProfileImageTC(image));

			if (meta.requestStatus === "rejected") {
				setErrorMessage(payload as string);
			} else {
				props.modalOff();
			}
		}

		setSubmitting(false);
	}
	function validate(e: { image?: FileList }) {
		const errors: {
			image?: string;
		} = {};
		// image
		if (e.image && e.image.length) {
			if (e.image[0].size > 10 * 1024 * 1024) {
				errors.image = "File size cannot be more than 10mb!";
			}
		}

		return errors;
	}

	return (
		<>
			<Form
				onSubmit={onSubmit}
				validate={validate}
				render={({ handleSubmit, pristine }) => (
					<form>
						<Field
							name="image"
							render={({ input: { onChange, value, ...input }, meta }) => (
								<div className="profile__user_image_field form__field">
									<label
										htmlFor="imageInput"
										id="imageInputLabel"
										className="profile__user_image_label form__label"
									>
										<img
											ref={newImageRef}
											src={props.userImage}
											alt={props.authNickname}
										/>
									</label>
									<input
										{...input}
										id="imageInput"
										onChange={(e) => {
											onUpdateProfileImage(e);
											onChange(e.target.files);
										}}
										type="file"
										accept="image/png, image/jpeg"
										style={{ display: "none" }}
									/>
									{meta.error && (
										<div className="profile__user_image_incorrect form__incorrect">
											{meta.error}
										</div>
									)}
								</div>
							)}
						/>

						{errorMessage && (
							<div className="profile__user_image_error form__error">
								{errorMessage}
							</div>
						)}

						<button
							onClick={handleSubmit}
							disabled={pristine || submitting}
							className="profile__user_image_button form__button"
						>
							{submitting ? <LoadingCircle /> : "Save"}
						</button>
					</form>
				)}
			/>
		</>
	);
}
