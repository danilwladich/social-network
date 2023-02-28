import React, { useLayoutEffect } from "react";
import { Support } from "./Support";
import { useAppDispatch } from "./../../../../hooks/useAppDispatch";
import { fetchDonationsTC } from "../../../../redux/reducers/settingsReducer";

function SupportAPI() {
	const dispatch = useAppDispatch();

	// fetching
	useLayoutEffect(() => {
		dispatch(fetchDonationsTC());
	}, [dispatch]);

	return (
		<>
			<Support />
		</>
	);
}

export default SupportAPI;
