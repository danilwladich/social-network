import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { LoadingCircle } from "../../../../assets/svg/LoadingCircle";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../../../App";
import { useAppSelector } from "./../../../../../hooks/useAppSelector";
import { useAppDispatch } from "./../../../../../hooks/useAppDispatch";
import { editProfileTC } from "../../../../../redux/reducers/profileReducer";

interface IProps {
	modalOff: () => void;
}

export function EditForm(props: IProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { userData } = useAppSelector((state) => state.profile);
	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);

	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const hostname = window.location.hostname;

	async function onSubmit(v: {
		nickname?: string;
		country?: string;
		city?: string;
	}) {
		setSubmitting(true);

		const { meta, payload } = await dispatch(
			editProfileTC({
				nickname: v.nickname?.trim(),
				country: v.country?.trim(),
				city: v.city?.trim(),
			})
		);

		if (meta.requestStatus === "rejected") {
			setErrorMessage(payload as string);
		} else {
			if (v.nickname) {
				socket.emit("nicknameChanged", { nickname: authNickname });
				navigate("/" + v.nickname);
			}
			props.modalOff();
		}

		setSubmitting(false);
	}
	function validate(e: { nickname?: string; country?: string; city?: string }) {
		const errors: {
			nickname?: string;
			country?: string;
			city?: string;
		} = {};
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
				if (e.nickname.trim() === authNickname) {
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
							name="nickname"
							render={({ input, meta }) => (
								<div className="profile__edit_field form__field">
									<label
										htmlFor="idInput"
										className="profile__edit_label form__label"
									>
										Nickname
										<p>
											{hostname +
												"/" +
												(values.nickname
													? values.nickname
															.trim()
															.slice(0, 15)
															.replace(/[^\w]/g, "")
													: authNickname)}
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
										placeholder={userData.location.country || "Your country"}
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
										placeholder={userData.location.city || "Your city"}
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
