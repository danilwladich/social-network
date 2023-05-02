import moment from "moment";

export function useDateToShow(date: number, short?: boolean) {
	let dateToShow;

	if (moment().diff(date, "years")) {
		dateToShow = moment(date).format("DD.MM.YYYY");
	} else {
		if (moment().diff(date, "days")) {
			dateToShow = moment(date).format("DD.MM");
		} else {
			dateToShow = moment(date).fromNow(short);
		}
	}

	return dateToShow;
}
