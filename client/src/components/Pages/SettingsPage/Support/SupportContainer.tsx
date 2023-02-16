import { connect } from "react-redux";
import { IState } from "../../../../models/IState";
import { Support } from "./Support";
import {
	getDonationsTC,
	newDonationTC,
} from "../../../../redux/settingsReducer";
import { useLayoutEffect } from "react";
import { DonationData } from "../../../../models/Settings/DonationData";

interface IProps {
	isAuth: boolean;
	bodyTheme: string;
	donationsData: DonationData[];
	getDonationsTC: () => Promise<void>;
	newDonationTC: (v: number) => Promise<void>;
}

function SupportAPI(props: IProps) {
	useLayoutEffect(() => {
		props.getDonationsTC();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Support {...props} />
		</>
	);
}

function mapStateToProps(state: IState) {
	return {
		isAuth: state.auth.isAuth,
		bodyTheme: state.settings.bodyTheme,
		donationsData: state.settings.donationsData,
	};
}

export const SupportContainer = connect(mapStateToProps, {
	getDonationsTC,
	newDonationTC,
})(SupportAPI);
