import { useRef, useState } from "react";
import { Field, Form } from "react-final-form";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	bodyTheme: string;
	registerTC: (
		phoneNumber: string,
		password: string,
		firstName: string,
		lastName: string,
		recaptcha: string
	) => Promise<void>;
}

export function RegisterForm(props: IProps) {
	const [errorMessage, setErrorMessage] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const recaptchaRef = useRef<ReCAPTCHA>(null);

	async function onSubmit(v: {
		phoneNumber: string;
		password: string;
		firstName: string;
		lastName: string;
	}) {
		setSubmitting(true);
		const recaptcha = await recaptchaRef.current?.executeAsync();
		if (!recaptcha) {
			setSubmitting(false);
			return () => setErrorMessage("Recaptcha error, try again");
		}
		props
			.registerTC(
				v.phoneNumber,
				v.password,
				v.firstName.trim(),
				v.lastName.trim(),
				recaptcha
			)
			.catch((reject) => {
				setErrorMessage(reject);
				recaptchaRef.current?.reset();
			})
			.finally(() => setSubmitting(false));
	}
	function validate(e: {
		phoneNumber: string;
		password: string;
		confirmPassword: string;
		firstName: string;
		lastName: string;
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
			errors.phoneNumber = "Reguired";
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
		}
		if (!e.password) {
			errors.password = "Reguired";
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
			errors.confirmPassword = "Reguired";
		}

		// first name
		if (e.firstName) {
			if (e.firstName.length < 2) {
				errors.firstName = "Too short!";
			}
			if (e.firstName.length > 15) {
				errors.firstName = "Too long!";
			}
			if (e.firstName[0].toUpperCase() !== e.firstName[0]) {
				errors.firstName = "Must be capitalized!";
			}
			if (e.firstName.slice(1).toLowerCase() !== e.firstName.slice(1)) {
				errors.firstName = "Must be capitalized!";
			}
			if (e.firstName.match(/[^a-zA-Z-]+/g)) {
				errors.firstName = "Only latin letters allowed!";
			}
		}
		if (!e.firstName) {
			errors.firstName = "Reguired";
		}

		// last name
		if (e.lastName) {
			if (e.lastName.length < 2) {
				errors.lastName = "Too short!";
			}
			if (e.lastName.length > 20) {
				errors.lastName = "Too long!";
			}
			if (e.lastName[0].toUpperCase() !== e.lastName[0]) {
				errors.lastName = "Must be capitalized!";
			}
			if (e.lastName.slice(1).toLowerCase() !== e.lastName.slice(1)) {
				errors.lastName = "Must be capitalized!";
			}
			if (e.lastName.match(/[^a-zA-Z-]+/g)) {
				errors.lastName = "Only latin letters allowed!";
			}
		}
		if (!e.lastName) {
			errors.lastName = "Reguired";
		}
		return errors;
	}

	return (
		<Form
			onSubmit={onSubmit}
			validate={validate}
			render={({ handleSubmit, pristine, hasValidationErrors }) => (
				<form>
					<Field
						name="phoneNumber"
						render={({ input, meta }) => (
							<div className="login__field">
								<label htmlFor="phoneNumberInput" className="login__label">
									Phone number
								</label>
								<PhoneInput
									{...input}
									id="phoneNumberInput"
									tabIndex={1}
									type="tel"
									autoComplete="tel"
									className="login__input"
									placeholder="+1 XXX XXX XXX"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect">{meta.error}</div>
								)}
							</div>
						)}
					/>

					<Field
						name="password"
						render={({ input, meta }) => (
							<div className="login__field">
								<label htmlFor="passwordInput" className="login__label">
									Password
								</label>
								<input
									{...input}
									id="passwordInput"
									tabIndex={2}
									type="password"
									className="login__input"
									placeholder="New password"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect">{meta.error}</div>
								)}
							</div>
						)}
					/>

					<Field
						name="confirmPassword"
						render={({ input, meta }) => (
							<div className="login__field">
								<label htmlFor="confirmPasswordInput" className="login__label">
									Confirm password
								</label>
								<input
									{...input}
									id="confirmPasswordInput"
									tabIndex={3}
									type="password"
									className="login__input"
									placeholder="Confirm password"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect">{meta.error}</div>
								)}
							</div>
						)}
					/>

					<Field
						name="firstName"
						render={({ input, meta }) => (
							<div className="login__field">
								<label htmlFor="firstNameInput" className="login__label">
									First name
								</label>
								<input
									{...input}
									id="firstNameInput"
									tabIndex={4}
									type="text"
									autoComplete="given-name"
									className="login__input"
									placeholder="Bob"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect">{meta.error}</div>
								)}
							</div>
						)}
					/>

					<Field
						name="lastName"
						render={({ input, meta }) => (
							<div className="login__field">
								<label htmlFor="lastNameInput" className="login__label">
									Last name
								</label>
								<input
									{...input}
									id="lastNameInput"
									tabIndex={5}
									type="text"
									autoComplete="family-name"
									className="login__input"
									placeholder="Dylan"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect">{meta.error}</div>
								)}
							</div>
						)}
					/>

					<ReCAPTCHA
						size="invisible"
						className="login__recaptcha"
						theme={props.bodyTheme as "light" | "dark"}
						sitekey="6LcwYyQkAAAAAMsq2VnRYkkqNqLt-ljuy-gfmPYn"
						ref={recaptchaRef}
					/>

					{errorMessage && <div className="login__error">{errorMessage}</div>}

					<button
						tabIndex={6}
						onClick={handleSubmit}
						disabled={pristine || submitting || hasValidationErrors}
						className="login__button"
					>
						{submitting ? <LoadingCircle /> : "Sign up"}
					</button>
				</form>
			)}
		/>
	);
}
