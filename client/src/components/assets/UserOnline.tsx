import React from "react";

interface IProps {
	online: string | boolean;
	className: string;
	small?: boolean;
}

export function UserOnline(props: IProps) {
	let userOnline: string | boolean = false;

	if (props.online === true) {
		userOnline = true;
	} else if (!props.small && typeof props.online === "string") {
		const date = props.online.split(" ");
		const dateNow = new Date().toString().split(" ").slice(1, 5);

		const year = +date[2];
		const yearNow = +dateNow[2];
		const month = date[0];
		const monthNow = dateNow[0];
		const day = +date[1];
		const dayNow = +dateNow[1];
		const hour = +date[3].split(":")[0];
		const hourNow = +dateNow[3].split(":")[0];
		const minutes = +date[3].split(":")[1];
		const minutesNow = +dateNow[3].split(":")[1];

		if (month === monthNow && year === yearNow) {
			if (day === dayNow) {
				if (
					hour === hourNow ||
					(hour + 1 === hourNow && minutes > minutesNow)
				) {
					if (minutesNow - minutes < 60 && minutesNow - minutes >= 0) {
						if (minutesNow - minutes === 0) {
							userOnline = "now";
						} else {
							userOnline = minutesNow - minutes + "min";
						}
					} else if (
						60 - minutes + minutesNow < 60 &&
						60 - minutes + minutesNow > 0
					) {
						userOnline = 60 - minutes + minutesNow + "min";
					} else {
						userOnline = "1h";
					}
				} else {
					userOnline = hourNow - hour + "h";
				}
			} else {
				userOnline = dayNow - day + "d";
			}
		} else {
			userOnline = ">1mon";
		}
	}

	return (
		<>
			<div
				className={
					props.className +
					" userOnline " +
					(props.small ? "small " : "") +
					(userOnline === true ? "active" : userOnline === false ? "empty" : "")
				}
			>
				{typeof userOnline === "string" && userOnline}
			</div>
		</>
	);
}
