import { useState } from "react";
import { Field, Form } from "react-final-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { LoadingCircle } from "../../assets/LoadingCircle";

interface IProps {
	loginTC: (phoneNumber: string, password: string) => Promise<void>;
}

export function LoginForm(props: IProps) {
	const [errorMessage, setErrorMessage] = useState("");
	const [submitting, setSubmitting] = useState(false);

	function onSubmit(v: { phoneNumber: string; password: string }) {
		setSubmitting(true);
		props
			.loginTC(v.phoneNumber, v.password)
			.catch((reject) => setErrorMessage(reject))
			.finally(() => setSubmitting(false));
	}
	function validate(e: { phoneNumber: string; password: string }) {
		const errors: { phoneNumber?: string; password?: string } = {};
		// phone number
		if (e.phoneNumber && !isValidPhoneNumber(e.phoneNumber)) {
			errors.phoneNumber = "Invalid format";
		}
		if (!e.phoneNumber) {
			errors.phoneNumber = "Reguired";
		}

		// password
		if (!e.password) {
			errors.password = "Reguired";
		}
		return errors;
	}

	return (
		<Form
			onSubmit={onSubmit}
			validate={validate}
			render={({ pristine, values, hasValidationErrors }) => (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (!hasValidationErrors) {
							onSubmit(values);
						}
					}}
				>
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
									placeholder="Your password"
								/>
								{meta.touched && meta.error && (
									<div className="login__incorrect">{meta.error}</div>
								)}
							</div>
						)}
					/>

					{errorMessage && <div className="login__error">{errorMessage}</div>}

					<button
						tabIndex={3}
						type="submit"
						disabled={pristine || submitting || hasValidationErrors}
						className="login__button"
					>
						{submitting ? <LoadingCircle /> : "Log In"}
					</button>
				</form>
			)}
		/>
	);
}
