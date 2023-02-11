import axios from "axios";
import FormData from "form-data";

let baseURL;
if (process.env.NODE_ENV === "production") {
	baseURL = "/api/";
} else {
	baseURL = "http://localhost:80/api/";
}
// 	baseURL = "http://10.8.0.109:80/api/";

const instance = axios.create({
	withCredentials: true,
	baseURL,
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
	getProfile(userNickname: string) {
		return instance
			.get(`profile/user/${userNickname}`)
			.then((response) => response.data);
	},
	getPosts(
		userNickname: string,
		page: number,
		pageSize: number,
		lastPostID: string | null
	) {
		return instance
			.get(
				`profile/posts/${userNickname}?page=${page}&count=${pageSize}` +
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
		nickname: string | null = null,
		country: string | null = null,
		city: string | null = null
	) {
		const formData = new FormData();
		image && formData.append("image", image, "avatar.jpg");
		nickname && formData.append("nickname", nickname);
		country && formData.append("country", country);
		city && formData.append("city", city);

		return instance
			.put(`profile/edit`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((response) => response.data);
	},

	// news
	getNews(page: number, pageSize: number, lastPostID: string | null) {
		return instance
			.get(
				`news?page=${page}&count=${pageSize}` +
					(!!lastPostID ? `&lastPostID=${lastPostID}` : "")
			)
			.then((response) => response.data);
	},

	// messages
	getChats() {
		return instance.get(`messages/chats`).then((response) => response.data);
	},
	getChat(
		userNickname: string,
		page: number,
		pageSize: number,
		lastMessageID: string | null
	) {
		return instance
			.get(
				`messages/chat/${userNickname}?page=${page}&count=${pageSize}` +
					(!!lastMessageID ? `&lastMessageID=${lastMessageID}` : "")
			)
			.then((response) => response.data);
	},
	deleteChat(userNickname: string) {
		return instance
			.delete(`messages/chat/${userNickname}`)
			.then((response) => response.data);
	},
	getCountOfUnreadMessages() {
		return instance.get(`messages/read`).then((response) => response.data);
	},

	// friends
	getFriends(
		userNickname: string,
		category: string,
		page: number,
		pageSize: number,
		lastUserNickname: string | null = null,
		search: string | null = null
	) {
		return instance
			.get(
				`friends/${userNickname}?category=${category}&page=${page}&count=${pageSize}` +
					(!!lastUserNickname ? `&lastUserNickname=${lastUserNickname}` : "") +
					(!!search ? `&search=${search}` : "")
			)
			.then((response) => response.data);
	},

	// users
	getUsers(
		page: number,
		pageSize: number,
		lastUserNickname: string | null = null,
		search: string | null = null
	) {
		return instance
			.get(
				`users?page=${page}&count=${pageSize}` +
					(!!lastUserNickname ? `&lastUserNickname=${lastUserNickname}` : "") +
					(!!search ? `&search=${search}` : "")
			)
			.then((response) => response.data);
	},

	// general
	followUser(userNickname: string) {
		return instance
			.post(`follow/${userNickname}`)
			.then((response) => response.data);
	},
	unfollowUser(userNickname: string) {
		return instance
			.delete(`follow/${userNickname}`)
			.then((response) => response.data);
	},

	// donations
	getDonations() {
		return instance.get(`donations`).then((response) => response.data);
	},
	newDonation(value: number) {
		return instance
			.post(`donations`, { value })
			.then((response) => response.data);
	},
};
