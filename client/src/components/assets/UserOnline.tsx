import React from "react";

interface IProps {
	online: string | boolean;
	className: string;
	small?: boolean;
}

export function UserOnline(props: IProps) {
	let userOnline: string | boolean = false;
	let className: "empty" | "active" | "" = "empty";
	let title = "";

	if (props.online === true) {
		userOnline = true;
		className = "active";
		title = "Online";
	} else if (!props.small && typeof props.online === "string") {
		const date = props.online.split(" ");
		const dateNow = new Date().toString().split(" ").slice(1, 5);

		const year = date[2];
		const yearNow = dateNow[2];
		const month = date[0];
		const monthNumber = new Date(Date.parse(props.online)).getMonth() + 1;
		const monthNumberNow = new Date().getMonth() + 1;
		const day = date[1];
		const dayNow = dateNow[1];
		const hour = date[3].split(":")[0];
		const hourNow = dateNow[3].split(":")[0];
		const minutes = date[3].split(":")[1];
		const minutesNow = dateNow[3].split(":")[1];
		const daysInMonth = new Date(+year, monthNumber, 0).getDate();

		if (
			+day === +dayNow &&
			monthNumber === monthNumberNow &&
			+year === +yearNow
		) {
			if (
				+hour === +hourNow ||
				(+hour + 1 === +hourNow && +minutes > +minutesNow)
			) {
				if (+minutesNow - +minutes < 60 && +minutesNow - +minutes >= 0) {
					if (+minutesNow - +minutes === 0) {
						userOnline = "Now";
					} else {
						userOnline = +minutesNow - +minutes + "min";
					}
				} else if (
					60 - +minutes + +minutesNow < 60 &&
					60 - +minutes + +minutesNow > 0
				) {
					userOnline = 60 - +minutes + +minutesNow + "min";
				} else {
					userOnline = "1h";
				}
			} else {
				userOnline = +hourNow - +hour + "h";
			}

			title = `Last online today at ${hour}:${minutes}`;
		} else if (
			(+day + 1 === +dayNow ||
				((monthNumber + 1 === monthNumberNow ||
					(12 - monthNumber + 1 === monthNumberNow &&
						+year + 1 === +yearNow)) &&
					daysInMonth - +dayNow + 1 === +day)) &&
			+hour > +hourNow
		) {
			userOnline = 24 - +hour + +hourNow + "h";

			title = `Last online ${day} ${month} at ${hour}:${minutes}`;
		} else {
			if (+year === +yearNow) {
				if (monthNumber === monthNumberNow) {
					if (+hour > +hourNow) {
						userOnline = +dayNow - +day - 1 + "d";
					} else {
						userOnline = +dayNow - +day + "d";
					}
				} else if (monthNumber + 1 === monthNumberNow) {
					if (+day >= +dayNow) {
						if (+hour > +hourNow) {
							userOnline = daysInMonth - +day + +dayNow - 1 + "d";
						} else {
							userOnline = daysInMonth - +day + +dayNow + "d";
						}
					} else {
						userOnline = monthNumberNow - monthNumber + "mon";
					}
				} else {
					userOnline = monthNumberNow - monthNumber + "mon";
				}

				title = `Last online ${day} ${month} at ${hour}:${minutes}`;
			} else if (+year + 1 === +yearNow) {
				if (12 - monthNumber + 1 === monthNumberNow) {
					if (+day >= +dayNow) {
						if (+hour > +hourNow) {
							userOnline = daysInMonth - +day + +dayNow - 1 + "d";
						} else {
							userOnline = daysInMonth - +day + +dayNow + "d";
						}
					} else {
						userOnline = 12 - monthNumber + monthNumberNow + "mon";
					}
				} else {
					userOnline = 12 - monthNumber + monthNumberNow + "mon";
				}

				title = `Last online ${day} ${month} ${year}`;
			} else {
				userOnline = +yearNow - +year + "y";

				title = `Last online ${day} ${month} ${year}`;
			}
		}

		className = "";
	}

	return (
		<>
			<div
				className={
					props.className +
					" userOnline " +
					(props.small ? "small " : "") +
					className
				}
				title={title}
			>
				{typeof userOnline === "string" && userOnline}
			</div>
		</>
	);
}
