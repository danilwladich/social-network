import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppLoading } from "./components/assets/svg/AppLoading";
import { AuthRedirect } from "./hoc/AuthRedirect";
import { NotExist } from "./components/Pages/NotExist/NotExist";

const LoginPage = React.lazy(
	() => import("./components/Pages/LoginPage/Login/LoginPage")
);
const RegisterPage = React.lazy(
	() => import("./components/Pages/LoginPage/Register/RegisterPage")
);
const ProfilePageContainer = React.lazy(
	() => import("./components/Pages/ProfilePage/ProfilePageContainer")
);
const NewsPageContainer = React.lazy(
	() => import("./components/Pages/NewsPage/NewsPageContainer")
);
const MessagesPage = React.lazy(
	() => import("./components/Pages/MessagesPage/MessagesPage")
);
const FriendsPageContainer = React.lazy(
	() => import("./components/Pages/FriendsPage/FriendsPageContainer")
);
const UsersPageContainer = React.lazy(
	() => import("./components/Pages/UsersPage/UsersPageContainer")
);
const SettingsPage = React.lazy(
	() => import("./components/Pages/SettingsPage/SettingsPage")
);

const routes = [
	{
		path: "/login",
		element: <LoginPage />,
		withSuspense: true,
		authRedirect: false,
	},
	{
		path: "/register",
		element: <RegisterPage />,
		withSuspense: true,
		authRedirect: false,
	},
	{
		path: "/:nickname?",
		element: <ProfilePageContainer />,
		withSuspense: true,
		authRedirect: false,
	},
	{
		path: "/news",
		element: <NewsPageContainer />,
		withSuspense: true,
		authRedirect: true,
	},
	{
		path: "/messages/:nickname?",
		element: <MessagesPage />,
		withSuspense: true,
		authRedirect: true,
	},
	{
		path: "/friends/:nickname?/:category?",
		element: <FriendsPageContainer />,
		withSuspense: true,
		authRedirect: false,
	},
	{
		path: "/users",
		element: <UsersPageContainer />,
		withSuspense: true,
		authRedirect: false,
	},
	{
		path: "/settings",
		element: <SettingsPage />,
		withSuspense: true,
		authRedirect: false,
	},
	{
		path: "/*",
		element: <NotExist />,
		withSuspense: false,
		authRedirect: false,
	},
];

export default function AppRoutes() {
	return (
		<Routes>
			{routes.map((route) =>
				route.withSuspense ? (
					<Route
						key={route.path}
						path={route.path}
						element={
							<React.Suspense fallback={<AppLoading />}>
								{route.authRedirect ? (
									<AuthRedirect>{route.element}</AuthRedirect>
								) : (
									route.element
								)}
							</React.Suspense>
						}
					/>
				) : (
					<Route key={route.path} path={route.path} element={route.element} />
				)
			)}
		</Routes>
	);
}
