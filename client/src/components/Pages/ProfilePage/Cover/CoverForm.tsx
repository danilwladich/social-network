import React, { useRef } from "react";
import { Field, Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { editProfileCoverTC } from "../../../../redux/reducers/profileReducer";
import { blobToData } from "../../../../hooks/useBlobToData";

interface IProps {
	authNickname: string;
	cover?: string;
	userImage?: string;
	modalOff: () => void;
}

export function CoverForm(props: IProps) {
	const dispatch = useAppDispatch();

	const newCoverRef = useRef<HTMLImageElement>(null);

	async function onUpdateProfileCover(e: React.ChangeEvent<HTMLInputElement>) {
		if (newCoverRef.current !== null && e.target.files?.length) {
			const file = e.target.files[0];

			if (file.type.split("/")[0] === "image") {
				if (file.size <= 10 * 1024 * 1024) {
					const result = await blobToData(file);
					newCoverRef.current.src = result;
					newCoverRef.current.alt = file.name;
				}
			}
		}
	}

	async function onSubmit(v: { cover?: FileList }) {
		if (v.cover) {
			const cover = v.cover[0];

			const { meta, payload } = await dispatch(editProfileCoverTC(cover));

			if (meta.requestStatus === "rejected") {
				return { [FORM_ERROR]: payload as string };
			}

			if (meta.requestStatus === "fulfilled") {
				props.modalOff();
			}
		}
	}
	function validate(e: { cover?: FileList }) {
		const errors: {
			cover?: string;
		} = {};
		// cover
		if (e.cover && e.cover.length) {
			if (e.cover[0].type.split("/")[0] !== "image") {
				errors.cover = "Only image allowed";
			}
			if (e.cover[0].size > 10 * 1024 * 1024) {
				errors.cover = "File size cannot be more than 10mb";
			}
		}

		return errors;
	}

	return (
		<>
			<Form
				onSubmit={onSubmit}
				validate={validate}
				render={({
					handleSubmit,
					submitting,
					pristine,
					values,
					submitError,
				}) => (
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

						{submitError && (
							<div className="profile__cover_error form__error">
								{submitError}
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
