import React, { useRef, useState } from "react";
import { Field, Form } from "react-final-form";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { editProfileCoverTC } from "../../../../redux/reducers/profileReducer";

interface IProps {
	authNickname: string;
	cover?: string;
	userImage?: string;
	modalOff: () => void;
}

export function CoverForm(props: IProps) {
	const dispatch = useAppDispatch();

	const newCoverRef = useRef<HTMLImageElement>(null);

	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	function onUpdateProfileCover(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files?.length && e.target.files[0].size <= 10 * 1024 * 1024) {
			const reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = function (e) {
				newCoverRef.current!.src = e.target?.result as string;
			};
		}
	}
	async function onSubmit(v: { cover?: FileList }) {
		setSubmitting(true);

		if (v.cover) {
			const cover = v.cover[0];

			const { meta, payload } = await dispatch(editProfileCoverTC(cover));

			if (meta.requestStatus === "rejected") {
				setErrorMessage(payload as string);
			} else {
				props.modalOff();
			}
		}

		setSubmitting(false);
	}
	function validate(e: { cover?: FileList }) {
		const errors: {
			cover?: string;
		} = {};
		// cover
		if (e.cover && e.cover.length) {
			if (e.cover[0].size > 10 * 1024 * 1024) {
				errors.cover = "File size cannot be more than 10mb!";
			}
		}

		return errors;
	}

	return (
		<>
			<Form
				onSubmit={onSubmit}
				validate={validate}
				render={({ handleSubmit, pristine, values }) => (
					<form>
						<Field
							name="cover"
							render={({ input: { onChange, value, ...input }, meta }) => (
								<div className="profile__cover_field form__field">
									<label
										htmlFor="coverInput"
										id="coverInputLabel"
										className="profile__cover_label form__label"
									>
										<img
											ref={newCoverRef}
											src={props.cover || props.userImage}
											className={
												!props.cover && (!values.cover || meta.error)
													? "blur"
													: ""
											}
											alt={props.authNickname + " cover"}
										/>
									</label>
									<input
										{...input}
										id="coverInput"
										onChange={(e) => {
											onUpdateProfileCover(e);
											onChange(e.target.files);
										}}
										type="file"
										accept="image/png, image/jpeg"
										style={{ display: "none" }}
									/>
									{meta.error && (
										<div className="profile__cover_incorrect form__incorrect">
											{meta.error}
										</div>
									)}
								</div>
							)}
						/>

						{errorMessage && (
							<div className="profile__cover_error form__error">
								{errorMessage}
							</div>
						)}

						<button
							onClick={handleSubmit}
							disabled={pristine || submitting}
							className="profile__cover_button form__button"
						>
							{submitting ? <LoadingCircle /> : "Save"}
						</button>
					</form>
				)}
			/>
		</>
	);
}
