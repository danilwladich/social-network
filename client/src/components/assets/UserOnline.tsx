import React from "react";
import moment from "moment";

interface IProps {
	online: number | boolean;
	className: string;
	small?: boolean;
}

export function UserOnline(props: IProps) {
	let userOnline: string | boolean = false;
	let className: "empty" | "active" | "" = "empty";
	let title = "";

	if (
		props.online === true ||
		(typeof props.online === "number" &&
			moment().diff(props.online, "minutes") < 5)
	) {
		userOnline = true;
		className = "active";
		title = "Online";
	} else if (!props.small && typeof props.online === "number") {
		moment.updateLocale("en", {
			relativeTime: {
				future: "in %s",
				past: "%s ago",
				s: "now",
				ss: "%d s",
				m: "1 min",
				mm: "%d min",
				h: "1 h",
				hh: "%d h",
				d: "1 d",
				dd: "%d d",
				w: "1 w",
				ww: "%d w",
				M: "1 mon",
				MM: "%d mon",
				y: "1 y",
				yy: "%d y",
			},
		});

		userOnline = moment(props.online).fromNow(true);

		moment.updateLocale("en", {
			relativeTime: {
				future: "in %s",
				past: "%s ago",
				s: "a few seconds",
				ss: "%d seconds",
				m: "a minute",
				mm: "%d minutes",
				h: "an hour",
				hh: "%d hours",
				d: "a day",
				dd: "%d days",
				w: "a week",
				ww: "%d weeks",
				M: "a month",
				MM: "%d months",
				y: "a year",
				yy: "%d years",
			},
		});

		title = "Last online ";
		if (moment().diff(props.online, "years")) {
			title += moment(props.online).format("DD.MM.YYYY HH:mm");
		} else {
			if (moment().diff(props.online, "days")) {
				title += moment(props.online).format("DD.MM HH:mm");
			} else {
				title += moment(props.online).format("HH:mm");
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
