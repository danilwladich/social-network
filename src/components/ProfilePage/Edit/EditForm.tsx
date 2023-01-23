import React, { useRef, useState } from "react";
import { Field, Form } from "react-final-form";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	authID: string;
	image?: string;
	editProfileTC: (
		image?: File,
		id?: string,
		country?: string,
		city?: string
	) => Promise<void>;
	modalOff: () => void;
}

export function EditForm(props: IProps) {
	const newImageRef = useRef<HTMLImageElement>(null);
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	function onUpdateProfileImage(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files?.length && e.target.files[0].size <= 10000000) {
			const reader = new FileReader();
			reader.readAsDataURL(e.target.files![0]);
			reader.onload = function (e) {
				newImageRef.current!.src = e.target?.result as string;
			};
		}
	}

	function onSubmit(v: {
		image?: FileList;
		id?: string;
		country?: string;
		city?: string;
	}) {
		setSubmitting(true);
		const image = v.image ? v.image[0] : undefined;
		props
			.editProfileTC(image, v.id, v.country, v.city)
			.then(() => props.modalOff())
			.catch((reject) => setErrorMessage(reject))
			.finally(() => setSubmitting(false));
	}
	function validate(e: { image?: FileList; id?: string }) {
		const errors: { image?: string; id?: string } = {};
		// image
		if (e.image && e.image.length) {
			if (e.image[0].size > 10000000) {
				errors.image = "File size cannot be more than 10mb!";
			}
		}

		// id
		if (e.id) {
			if (e.id.length < 4) {
				errors.id = "Too short!";
			}
			if (e.id.length > 15) {
				errors.id = "Too long!";
			}
			if (
				e.id === "login" ||
				e.id === "register" ||
				e.id === "messages" ||
				e.id === "friends" ||
				e.id === "users" ||
				e.id === "settings" ||
				e.id === "posts"
			) {
				errors.id = "Not allowed!";
			}
			if (e.id.match(/[^\w]/g)) {
				errors.id = "Allow only alphanumeric!";
			}
		}

		return errors;
	}
	return (
		<>
			<Form
				onSubmit={onSubmit}
				validate={validate}
				render={({ handleSubmit, pristine, values, hasValidationErrors }) => (
					<form>
						<Field
							name="image"
							render={({ input: { onChange, value, ...input }, meta }) => (
								<div className="profile__edit_field">
									<label
										htmlFor="imageInput"
										id="imageInputLabel"
										className="profile__edit_label row"
									>
										<span>Update profile image</span>
										<img
											ref={newImageRef}
											src={props.image || "/images/user.jpg"}
											alt="user"
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
										<div className="profile__edit_incorrect">{meta.error}</div>
									)}
								</div>
							)}
						/>

						<Field
							name="id"
							render={({ input, meta }) => (
								<div className="profile__edit_field">
									<label htmlFor="idInput" className="profile__edit_label">
										Nickname
										<p>
											socnet.com/
											{values.id
												? values.id.slice(0, 14).replace(/[^\w]/g, "")
												: props.authID}
										</p>
									</label>
									<input
										{...input}
										id="idInput"
										type="text"
										className="profile__edit_input"
										placeholder="New nickname"
									/>
									{meta.error && (
										<div className="profile__edit_incorrect">{meta.error}</div>
									)}
								</div>
							)}
						/>

						<Field
							name="country"
							render={({ input: { value, onChange } }) => (
								<div className="profile__edit_field">
									<label htmlFor="countryInput" className="profile__edit_label">
										County
									</label>
									<CountryDropdown
										onChange={onChange}
										value={value}
										id="countryInput"
										classes={"profile__edit_input " + (!value ? "empty" : "")}
									/>
								</div>
							)}
						/>

						<Field
							name="city"
							render={({ input: { value, onChange } }) => (
								<div className="profile__edit_field">
									<label htmlFor="cityInput" className="profile__edit_label">
										City
									</label>
									<RegionDropdown
										country={values.country ? values.country : ""}
										onChange={onChange}
										value={value}
										id="cityInput"
										classes={"profile__edit_input " + (!value ? "empty" : "")}
									/>
								</div>
							)}
						/>

						{errorMessage && (
							<div className="profile__edit_error">{errorMessage}</div>
						)}

						<button
							onClick={handleSubmit}
							disabled={pristine || submitting || hasValidationErrors}
							className="profile__edit_button"
						>
							{submitting ? <LoadingCircle /> : "Save"}
						</button>
					</form>
				)}
			/>
		</>
	);
}
