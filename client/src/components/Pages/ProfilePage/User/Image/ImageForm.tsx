import React, { useRef } from "react";
import { Field, Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { LoadingCircle } from "../../../../assets/svg/LoadingCircle";
import { useAppDispatch } from "./../../../../../hooks/useAppDispatch";
import { editProfileImageTC } from "../../../../../redux/reducers/profileReducer";
import { blobToData } from "../../../../../hooks/useBlobToData";

interface IProps {
	authNickname: string;
	userImage: string;
	modalOff: () => void;
}

export function ImageForm(props: IProps) {
	const dispatch = useAppDispatch();

	const newImageRef = useRef<HTMLImageElement>(null);

	async function onUpdateProfileImage(e: React.ChangeEvent<HTMLInputElement>) {
		if (newImageRef.current !== null && e.target.files?.length) {
			const file = e.target.files[0];

			if (file.type.split("/")[0] === "image") {
				if (file.size <= 10 * 1024 * 1024) {
					const result = await blobToData(file);
					newImageRef.current.src = result;
					newImageRef.current.alt = file.name;
				}
			}
		}
	}

	async function onSubmit(v: { image?: FileList }) {
		if (v.image) {
			const image = v.image[0];

			const { meta, payload } = await dispatch(editProfileImageTC(image));

			if (meta.requestStatus === "rejected") {
				return { [FORM_ERROR]: payload as string };
			}

			if (meta.requestStatus === "fulfilled") {
				props.modalOff();
			}
		}
	}
	function validate(e: { image?: FileList }) {
		const errors: {
			image?: string;
		} = {};
		// image
		if (e.image && e.image.length) {
			if (e.image[0].type.split("/")[0] !== "image") {
				errors.image = "Only image allowed";
			}
			if (e.image[0].size > 10 * 1024 * 1024) {
				errors.image = "File size cannot be more than 10mb";
			}
		}

		return errors;
	}

	return (
		<>
			<Form
				onSubmit={onSubmit}
				validate={validate}
				render={({ handleSubmit, submitting, pristine, submitError }) => (
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

						{submitError && (
							<div className="profile__user_image_error form__error">
								{submitError}
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
