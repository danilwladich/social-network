import React, { useRef } from "react";
import { Field, Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { registerTC } from "../../../../redux/reducers/authReducer";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";

export function RegisterForm() {
	const dispatch = useAppDispatch();

	const recaptchaRef = useRef<ReCAPTCHA>(null);

	const { bodyTheme } = useAppSelector((state) => state.settings);

	async function onSubmit(v: {
		phoneNumber: string;
		password: string;
		firstName: string;
		lastName: string;
	}) {
		const recaptcha = await recaptchaRef.current?.executeAsync();
		if (!recaptcha) {
			recaptchaRef.current?.reset();
			return { [FORM_ERROR]: "Recaptcha error, try again" };
		}

		const { meta, payload } = await dispatch(
			registerTC({
				phoneNumber: v.phoneNumber,
				password: v.password,
				firstName: v.firstName.trim(),
				lastName: v.lastName.trim(),
				recaptcha,
			})
		);

		if (meta.requestStatus === "rejected") {
			recaptchaRef.current!.reset();
			return { [FORM_ERROR]: payload as string };
		}
	}
	function validate(e: {
		phoneNumber?: string;
		password?: string;
		confirmPassword?: string;
		firstName?: string;
		lastName?: string;
	}) {
		const errors: {
			phoneNumber?: string;
			password?: string;
			confirmPassword?: string;
			firstName?: string;
			lastName?: string;
		} = {};
		// phone number
		if (e.phoneNumber && !isValidPhoneNumber(e.phoneNumber)) {
			errors.phoneNumber = "Invalid format";
		}
		if (!e.phoneNumber) {
			errors.phoneNumber = "Required";
		}

		// password
		if (e.password) {
			if (e.password.length < 8) {
				errors.password = "Too short!";
			}
			if (!e.password.match(/[A-Z]/g)) {
				errors.password = "Must contain latin uppercase letter!";
			}
			if (!e.password.match(/[a-z]/g)) {
				errors.password = "Must contain latin lowercase letter!";
			}
			if (!e.password.match(/[0-9]/g)) {
				errors.password = "Must contain number!";
			}
			if (e.password.match(/\s/)) {
				errors.password = "Cannot contain spaces!";
			}
		}
		if (!e.password) {
			errors.password = "Required";
		}

		// confirm password
		if (e.confirmPassword) {
			if (e.confirmPassword.length < 7) {
				errors.confirmPassword = "Too short!";
			}
			if (e.password && e.confirmPassword !== e.password) {
				errors.confirmPassword = "Passwords do not match!";
			}
		}
		if (!e.confirmPassword) {
			errors.confirmPassword = "Required";
		}

		// first name
		if (e.firstName) {
			if (e.firstName.trim()) {
				if (e.firstName.trim().length < 2) {
					errors.firstName = "Too short!";
				}
				if (e.firstName.trim().length > 15) {
					errors.firstName = "Too long!";
				}
				if (e.firstName.trim()[0].toUpperCase() !== e.firstName.trim()[0]) {
					errors.firstName = "Must be capitalized!";
				}
				if (
					e.firstName.trim().slice(1).toLowerCase() !==
					e.firstName.trim().slice(1)
				) {
					errors.firstName = "Must be capitalized!";
				}
				if (e.firstName.trim().match(/[^a-zA-Z-]+/g)) {
					errors.firstName = "Only latin letters allowed!";
				}
			}
		}
		if (!e.firstName) {
			errors.firstName = "Required";
		}

		// last name
		if (e.lastName) {
			if (e.lastName.trim()) {
				if (e.lastName.trim().length < 2) {
					errors.lastName = "Too short!";
				}
				if (e.lastName.trim().length > 20) {
					errors.lastName = "Too long!";
				}
				if (e.lastName.trim()[0].toUpperCase() !== e.lastName.trim()[0]) {
					errors.lastName = "Must be capitalized!";
				}
				if (
					e.lastName.trim().slice(1).toLowerCase() !==
					e.lastName.trim().slice(1)
				) {
					errors.lastName = "Must be capitalized!";
				}
				if (e.lastName.trim().match(/[^a-zA-Z-]+/g)) {
					errors.lastName = "Only latin letters allowed!";
				}
			}
		}
		if (!e.lastName) {
			errors.lastName = "Required";
		}
		return errors;
	}

	return (
		<Form
			onSubmit={onSubmit}
			validate={validate}
			render={({ handleSubmit, submitting, pristine, submitError }) => (
				<form>
					<Field
						name="phoneNumber"
						render={({ input, meta }) => (
							<div className="login__field form__field">
								<label
									htmlFor="phoneNumberInput"
									className="login__label form__label"
								>
									Phone number
								</label>
								<PhoneInput
									{...input}
									id="phoneNumberInput"
									tabIndex={1}
									type="tel"
									autoComplete="tel"
									className="login__input form__input"
									placeholder="+1 XXX XXX XXX"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect form__incorrect">
										{meta.error}
									</div>
								)}
							</div>
						)}
					/>

					<Field
						name="password"
						render={({ input, meta }) => (
							<div className="login__field form__field">
								<label
									htmlFor="passwordInput"
									className="login__label form__label"
								>
									Password
								</label>
								<input
									{...input}
									id="passwordInput"
									tabIndex={2}
									type="password"
									className="login__input form__input"
									placeholder="New password"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect form__incorrect">
										{meta.error}
									</div>
								)}
							</div>
						)}
					/>

					<Field
						name="confirmPassword"
						render={({ input, meta }) => (
							<div className="login__field form__field">
								<label
									htmlFor="confirmPasswordInput"
									className="login__label form__label"
								>
									Confirm password
								</label>
								<input
									{...input}
									id="confirmPasswordInput"
									tabIndex={3}
									type="password"
									className="login__input form__input"
									placeholder="Confirm password"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect form__incorrect">
										{meta.error}
									</div>
								)}
							</div>
						)}
					/>

					<Field
						name="firstName"
						render={({ input, meta }) => (
							<div className="login__field form__field">
								<label
									htmlFor="firstNameInput"
									className="login__label form__label"
								>
									First name
								</label>
								<input
									{...input}
									id="firstNameInput"
									tabIndex={4}
									type="text"
									autoComplete="given-name"
									className="login__input form__input"
									placeholder="First name"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect form__incorrect">
										{meta.error}
									</div>
								)}
							</div>
						)}
					/>

					<Field
						name="lastName"
						render={({ input, meta }) => (
							<div className="login__field form__field">
								<label
									htmlFor="lastNameInput"
									className="login__label form__label"
								>
									Last name
								</label>
								<input
									{...input}
									id="lastNameInput"
									tabIndex={5}
									type="text"
									autoComplete="family-name"
									className="login__input form__input"
									placeholder="Last name"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect form__incorrect">
										{meta.error}
									</div>
								)}
							</div>
						)}
					/>

					<ReCAPTCHA
						size="invisible"
						className="login__recaptcha"
						theme={bodyTheme as "light" | "dark"}
						sitekey="6LcwYyQkAAAAAMsq2VnRYkkqNqLt-ljuy-gfmPYn"
						ref={recaptchaRef}
					/>

					{submitError && (
						<div className="login__error form__error">{submitError}</div>
					)}

					<button
						tabIndex={6}
						onClick={handleSubmit}
						disabled={pristine || submitting}
						className="login__button form__button"
					>
						{submitting ? <LoadingCircle /> : "Sign up"}
					</button>
				</form>
			)}
		/>
	);
}
