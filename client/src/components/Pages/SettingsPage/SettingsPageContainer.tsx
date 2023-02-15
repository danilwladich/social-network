import { AuthRedirect } from "../../../hoc/AuthRedirect";
import { compose } from "redux";
import { SettingsPage } from "./SettingsPage";

const SettingsPageContainer = compose(
	AuthRedirect
)(SettingsPage);

export default SettingsPageContainer;
