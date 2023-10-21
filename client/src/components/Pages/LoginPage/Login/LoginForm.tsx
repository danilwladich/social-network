import React, { useRef } from "react";
import { Field, Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { loginTC } from "../../../../redux/reducers/authReducer";
import { useAppSelector } from "./../../../../hooks/useAppSelector";

export function LoginForm() {
	const dispatch = useAppDispatch();

	const recaptchaRef = useRef<ReCAPTCHA>(null);

	const { bodyTheme } = useAppSelector((state) => state.settings);

	async function onSubmit(v: { phoneNumber: string; password: string }) {
		const recaptcha = await recaptchaRef.current?.executeAsync();
		if (!recaptcha) {
			recaptchaRef.current?.reset();
			return { [FORM_ERROR]: "Recaptcha error, try again" };
		}

		const { meta, payload } = await dispatch(
			loginTC({ phoneNumber: v.phoneNumber, password: v.password, recaptcha })
		);

		if (meta.requestStatus === "rejected") {
			recaptchaRef.current!.reset();
			return { [FORM_ERROR]: payload as string };
		}
	}
	function validate(e: { phoneNumber?: string; password?: string }) {
		const errors: { phoneNumber?: string; password?: string } = {};
		// phone number
		if (e.phoneNumber && !isValidPhoneNumber(e.phoneNumber)) {
			errors.phoneNumber = "Invalid format";
		}
		if (!e.phoneNumber) {
			errors.phoneNumber = "Required";
		}

		// password
		if (!e.password) {
			errors.password = "Required";
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
									className={`login__input form__input ${
										meta.touched && meta.error ? "form__input_error" : ""
									}`}
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
									className={`login__input form__input ${
										meta.touched && meta.error ? "form__input_error" : ""
									}`}
									placeholder="Your password"
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
						tabIndex={3}
						type="submit"
						onClick={handleSubmit}
						disabled={pristine || submitting}
						className="login__button form__button"
					>
						{submitting ? <LoadingCircle /> : "Log In"}
					</button>
				</form>
			)}
		/>
	);
}
