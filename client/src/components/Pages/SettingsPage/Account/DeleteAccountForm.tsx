import React from "react";
import { Field, Form } from "react-final-form";
import { LoadingCircle } from "../../../assets/svg/LoadingCircle";
import { useNavigate } from "react-router-dom";
import { FORM_ERROR } from "final-form";
import { socket } from "../../../../App";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { deleteAccountTC } from "../../../../redux/reducers/authReducer";
import { useAppSelector } from "./../../../../hooks/useAppSelector";

export function DeleteAccountForm() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { nickname: authNickname } = useAppSelector((state) => state.auth.user);

	async function onSubmit(v: { password: string }) {
		const { meta, payload } = await dispatch(deleteAccountTC(v.password));

		if (meta.requestStatus === "rejected") {
			return { [FORM_ERROR]: payload as string };
		}

		if (meta.requestStatus === "fulfilled") {
			navigate("/login");
			socket.emit("deleteAccount", { nickname: authNickname });
		}
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
				render={({ handleSubmit, submitting, pristine, submitError }) => (
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
										className={`settings__delete_input form__input ${
											meta.touched && meta.error ? "form__input_error" : ""
										}`}
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
										className={`settings__delete_input form__input ${
											meta.touched && meta.error ? "form__input_error" : ""
										}`}
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

						{submitError && (
							<div className="settings__delete_error form__error">
								{submitError}
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
