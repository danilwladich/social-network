import React from "react";

interface IProps {
	date: string;
	short?: boolean;
}

export function DateToShow(props: IProps) {
	const date = props.date.split(" ");
	const dateNow = new Date().toString().split(" ").slice(1, 5);

	const year = date[2];
	const yearNow = dateNow[2];
	const month = date[0];
	const monthNumber = new Date(Date.parse(props.date)).getMonth() + 1;
	const monthNumberNow = new Date().getMonth() + 1;
	const day = date[1];
	const dayNow = dateNow[1];
	const hour = date[3].split(":")[0];
	const hourNow = dateNow[3].split(":")[0];
	const minutes = date[3].split(":")[1];
	const minutesNow = dateNow[3].split(":")[1];
	const daysInMonth = new Date(+year, monthNumber, 0).getDate();

	let dateToShow;
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
					dateToShow = props.short ? "Now" : "Just now";
				} else {
					dateToShow = `${+minutesNow - +minutes}min ${
						!props.short ? "ago" : ""
					}`;
				}
			} else if (
				60 - +minutes + +minutesNow < 60 &&
				60 - +minutes + +minutesNow > 0
			) {
				dateToShow = `${60 - +minutes + +minutesNow}min ${
					!props.short ? "ago" : ""
				}`;
			} else {
				dateToShow = `1h ${!props.short ? "ago" : ""}`;
			}
		} else {
			dateToShow = `${+hourNow - +hour}h ${!props.short ? "ago" : ""}`;
		}
	} else if (
		(+day + 1 === +dayNow ||
			((monthNumber + 1 === monthNumberNow ||
				(12 - monthNumber + 1 === monthNumberNow && +year + 1 === +yearNow)) &&
				daysInMonth - +dayNow + 1 === +day)) &&
		+hour > +hourNow &&
		+day >= +dayNow
	) {
		dateToShow = `${24 - +hour + +hourNow}h ${!props.short ? "ago" : ""}`;
	} else {
		if (+year === +yearNow) {
			dateToShow = `${day} ${month} ${
				!props.short ? `at ${hour}:${minutes}` : ""
			}`;
		} else {
			dateToShow = `${day} ${month} ${year}`;
		}
	}

	return (
		<span
			className="dateToShow"
			title={
				+year === +yearNow
					? `${day} ${month} at ${hour}:${minutes}`
					: `${day} ${month} ${year} at ${hour}:${minutes}`
			}
		>
			{dateToShow}
		</span>
	);
}
