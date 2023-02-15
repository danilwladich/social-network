import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { LoadingCircle } from "../../../Assets/LoadingCircle";

interface IProps {
	deleteAccountTC: (password: string) => Promise<void>;
	modalOff: () => void;
}

export function DeleteAccountForm(props: IProps) {
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	function onSubmit(v: { password: string }) {
		setSubmitting(true);
		props
			.deleteAccountTC(v.password)
			.then(() => props.modalOff())
			.catch((reject) => setErrorMessage(reject))
			.finally(() => setSubmitting(false));
	}

	function validate(e: { password: string; confirmPassword: string }) {
		const errors: { password?: string; confirmPassword?: string } = {};
		// password
		if (!e.password) {
			errors.password = "Required";
		}

		// confirm password
		if (e.confirmPassword) {
			if (e.password && e.confirmPassword !== e.password) {
				errors.confirmPassword = "Passwords do not match!";
			}
		}
		if (!e.confirmPassword) {
			errors.confirmPassword = "Required";
		}

		return errors;
	}

	return (
		<>
			<Form
				onSubmit={onSubmit}
				validate={validate}
				render={({ handleSubmit, pristine }) => (
					<form>
						<Field
							name="password"
							render={({ input, meta }) => (
								<div className="settings__delete_field form__field">
									<label
										htmlFor="passwordInput"
										className="settings__delete_label form__label"
									>
										Password
									</label>
									<input
										{...input}
										id="passwordInput"
										autoFocus
										autoComplete="off"
										tabIndex={1}
										type="password"
										className="settings__delete_input form__input"
										placeholder="Password"
									/>
									{meta.touched && meta.error && (
										<div className="settings__delete_incorrect form__incorrect">
											{meta.error}
										</div>
									)}
								</div>
							)}
						/>

						<Field
							name="confirmPassword"
							render={({ input, meta }) => (
								<div className="settings__delete_field form__field">
									<label
										htmlFor="confirmPasswordInput"
										className="settings__delete_label form__label"
									>
										Confirm password
									</label>
									<input
										{...input}
										id="confirmPasswordInput"
										tabIndex={2}
										autoComplete="off"
										type="password"
										className="settings__delete_input form__input"
										placeholder="Confirm password"
									/>
									{meta.touched && meta.error && (
										<div className="settings__delete_incorrect form__incorrect">
											{meta.error}
										</div>
									)}
								</div>
							)}
						/>

						{errorMessage && (
							<div className="settings__delete_error form__error">
								{errorMessage}
							</div>
						)}

						<button
							onClick={handleSubmit}
							disabled={pristine || submitting}
							className="settings__delete_button form__button"
						>
							{submitting ? <LoadingCircle /> : "Delete"}
						</button>
					</form>
				)}
			/>
		</>
	);
}
