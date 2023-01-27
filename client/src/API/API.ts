import axios from "axios";
import FormData from "form-data";

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
	login(phoneNumber: string, password: string, recaptcha: string) {
		return instance
			.post(`auth/login`, { phoneNumber, password, recaptcha })
			.then((response) => response.data);
	},
	register(
		phoneNumber: string,
		password: string,
		firstName: string,
		lastName: string,
		recaptcha: string
	) {
		return instance
			.post(`auth/register`, {
				phoneNumber,
				password,
				firstName,
				lastName,
				recaptcha,
			})
			.then((response) => response.data);
	},
	logout() {
		return instance.delete(`auth/me`).then((response) => response.data);
	},
	deleteAccount(password: string) {
		return instance
			.delete(`auth/delete`, { data: { password } })
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
	deletePost(postID: string) {
		return instance
			.delete(`profile/posts/${postID}`)
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
		const formData = new FormData();
		image && formData.append("image", image, "avatar.jpg");
		id && formData.append("id", id);
		country && formData.append("country", country);
		city && formData.append("city", city);

		return instance
			.put(`profile/edit`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((response) => response.data);
	},

	// messages
	getChats() {
		return instance.get(`messages`).then((response) => response.data);
	},
	getChat(userID: string) {
		return instance.get(`messages/${userID}`).then((response) => response.data);
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
