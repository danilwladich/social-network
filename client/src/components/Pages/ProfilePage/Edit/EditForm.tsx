import React, { useRef, useState } from "react";
import { Field, Form } from "react-final-form";
import { LoadingCircle } from "../../../Assets/LoadingCircle";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../../App";
import { ProfileUserData } from "../../../../models/Profile/ProfileUserData";

interface IProps {
	userData: ProfileUserData;
	authNickname: string;
	editProfileTC: (
		image?: File,
		nickname?: string,
		country?: string,
		city?: string
	) => Promise<void>;
}

export function EditForm(props: IProps) {
	const navigate = useNavigate();
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
		nickname?: string;
		country?: string;
		city?: string;
	}) {
		setSubmitting(true);
		const image = v.image ? v.image[0] : undefined;
		props
			.editProfileTC(
				image,
				v.nickname?.trim(),
				v.country?.trim(),
				v.city?.trim()
			)
			.then(() => {
				if (!!v.nickname) {
					socket.emit("nicknameChanged", { nickname: props.authNickname });
				}
				navigate("/");
			})
			.catch((reject) => setErrorMessage(reject))
			.finally(() => setSubmitting(false));
	}
	function validate(e: {
		image?: FileList;
		nickname?: string;
		country?: string;
		city?: string;
	}) {
		const errors: {
			image?: string;
			nickname?: string;
			country?: string;
			city?: string;
		} = {};
		// image
		if (e.image && e.image.length) {
			if (e.image[0].size > 10 * 1024 * 1024) {
				errors.image = "File size cannot be more than 10mb!";
			}
		}

		// nickname
		if (e.nickname) {
			if (e.nickname.trim()) {
				if (e.nickname.trim().length < 4) {
					errors.nickname = "Too short!";
				}
				if (e.nickname.trim().length > 15) {
					errors.nickname = "Too long!";
				}
				if (
					e.nickname.trim() === "login" ||
					e.nickname.trim() === "register" ||
					e.nickname.trim() === "messages" ||
					e.nickname.trim() === "friends" ||
					e.nickname.trim() === "users" ||
					e.nickname.trim() === "settings" ||
					e.nickname.trim() === "news" ||
					e.nickname.trim() === "images"
				) {
					errors.nickname = "Not allowed!";
				}
				if (e.nickname.trim() === props.authNickname) {
					errors.nickname = "It's already your nickname";
				}
				if (e.nickname.trim().match(/[^\w]/g)) {
					errors.nickname = "Allow only alphanumeric!";
				}
			}
		}

		// country
		if (e.country) {
			if (e.country.trim()) {
				if (e.country.trim().length < 2) {
					errors.country = "Too short!";
				}
				if (e.country.trim().length > 25) {
					errors.country = "Too short!";
				}
				if (e.country.trim().match(/[^a-zA-Z-]+/g)) {
					errors.country = "Allow only latin letters!";
				}
			}
		}

		// city
		if (e.city) {
			if (e.city.trim()) {
				if (e.city.trim().length < 2) {
					errors.city = "Too short!";
				}
				if (e.city.trim().length > 25) {
					errors.city = "Too short!";
				}
				if (e.city.trim().match(/[^a-zA-Z-]+/g)) {
					errors.city = "Allow only latin letters!";
				}
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
							name="image"
							render={({ input: { onChange, value, ...input }, meta }) => (
								<div className="profile__edit_field form__field">
									<label
										htmlFor="imageInput"
										id="imageInputLabel"
										className="profile__edit_label form__label row"
									>
										<span>Update profile image</span>
										<img
											ref={newImageRef}
											src={props.userData.image || "/images/user.jpg"}
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
										<div className="profile__edit_incorrect form__incorrect">
											{meta.error}
										</div>
									)}
								</div>
							)}
						/>

						<Field
							name="nickname"
							render={({ input, meta }) => (
								<div className="profile__edit_field form__field">
									<label
										htmlFor="idInput"
										className="profile__edit_label form__label"
									>
										Nickname
										<p>
											bloxx.com.pl/
											{values.nickname
												? values.nickname
														.trim()
														.slice(0, 15)
														.replace(/[^\w]/g, "")
												: props.authNickname}
										</p>
									</label>
									<input
										{...input}
										id="idInput"
										type="text"
										className="profile__edit_input form__input"
										placeholder="New nickname"
									/>
									{meta.touched && meta.error && (
										<div className="profile__edit_incorrect form__incorrect">
											{meta.error}
										</div>
									)}
								</div>
							)}
						/>

						<Field
							name="country"
							render={({ input, meta }) => (
								<div className="profile__edit_field form__field">
									<label
										htmlFor="countryInput"
										className="profile__edit_label form__label"
									>
										County
									</label>
									<input
										{...input}
										id="countryInput"
										type="text"
										className="profile__edit_input form__input"
										placeholder={
											props.userData.location.country || "Your country"
										}
									/>
									{meta.touched && meta.error && (
										<div className="profile__edit_incorrect form__incorrect">
											{meta.error}
										</div>
									)}
								</div>
							)}
						/>

						<Field
							name="city"
							render={({ input, meta }) => (
								<div className="profile__edit_field form__field">
									<label
										htmlFor="cityInput"
										className="profile__edit_label form__label"
									>
										City
									</label>
									<input
										{...input}
										id="cityInput"
										type="text"
										className="profile__edit_input form__input"
										placeholder={props.userData.location.city || "Your city"}
									/>
									{meta.touched && meta.error && (
										<div className="profile__edit_incorrect form__incorrect">
											{meta.error}
										</div>
									)}
								</div>
							)}
						/>

						{errorMessage && (
							<div className="profile__edit_error form__error">
								{errorMessage}
							</div>
						)}

						<button
							onClick={handleSubmit}
							disabled={pristine || submitting}
							className="profile__edit_button form__button"
						>
							{submitting ? <LoadingCircle /> : "Save"}
						</button>
					</form>
				)}
			/>
		</>
	);
}
