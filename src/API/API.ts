import axios from "axios";

const instance = axios.create({
	withCredentials: true,

	baseURL: "http://localhost:80/api/",
	headers: {
		"Content-Type": "application/json",
	},
});

export const API = {
	// auth
	authMe() {
		return instance.get(`auth/me`).then((response) => response.data);
	},
	login(phoneNumber: string, password: string) {
		return instance
			.post(`auth/login`, { phoneNumber, password })
			.then((response) => response.data);
	},
	register(
		phoneNumber: string,
		password: string,
		firstName: string,
		lastName: string
	) {
		return instance
			.post(`auth/register`, { phoneNumber, password, firstName, lastName })
			.then((response) => response.data);
	},
	logout() {
		return instance.delete(`auth/me`).then((response) => response.data);
	},
	deleteAccount(password: string, confirmPassword: string) {
		return instance
			.delete(`delete/account`, { data: { password, confirmPassword } })
			.then((response) => response.data);
	},

	// profile
	getProfile(userID: string) {
		return instance.get(`profile/${userID}`).then((response) => response.data);
	},
	getPosts(
		userID: string,
		page: number,
		pageSize: number,
		lastPostID: string | null
	) {
		return instance
			.get(
				`profile/posts/${userID}?page=${page}&count=${pageSize}` +
					(!!lastPostID ? `&lastPostID=${lastPostID}` : "")
			)
			.then((response) => response.data);
	},
	addPost(post: string) {
		return instance
			.post(`profile/posts`, { post })
			.then((response) => response.data);
	},
	likePost(postID: string) {
		return instance
			.post(`profile/posts/like/${postID}`)
			.then((response) => response.data);
	},
	unlikePost(postID: string) {
		return instance
			.delete(`profile/posts/like/${postID}`)
			.then((response) => response.data);
	},
	editProfile(
		image: File | null = null,
		id: string | null = null,
		country: string | null = null,
		city: string | null = null
	) {
		return instance
			.put(`profile/edit`, { image, id, country, city })
			.then((response) => response.data);
	},

	// friends
	getFriends(
		userID: string,
		category: string,
		page: number,
		pageSize: number,
		lastUserID: string | null
	) {
		return instance
			.get(
				`friends/${userID}?category=${category}&page=${page}&count=${pageSize}` +
					(!!lastUserID ? `&lastUserID=${lastUserID}` : "")
			)
			.then((response) => response.data);
	},

	// users
	getUsers(page: number, pageSize: number, lastUserID: string | null) {
		return instance
			.get(
				`users?page=${page}&count=${pageSize}` +
					(!!lastUserID ? `&lastUserID=${lastUserID}` : "")
			)
			.then((response) => response.data);
	},

	// general
	followUser(userID: string) {
		return instance.post(`follow/${userID}`).then((response) => response.data);
	},
	unfollowUser(userID: string) {
		return instance
			.delete(`follow/${userID}`)
			.then((response) => response.data);
	},
};
