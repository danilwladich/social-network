import axios from "axios";
import FormData from "form-data";

let baseURL;
if (process.env.NODE_ENV === "production") {
	baseURL = "/api/";
} else {
	baseURL = "http://localhost:80/api/";
}

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
				`posts/${userNickname}?page=${page}&count=${pageSize}` +
					(!!lastPostID ? `&lastPostID=${lastPostID}` : "")
			)
			.then((response) => response.data);
	},
	addPost(post: string | null = null, images: FileList | null = null) {
		const formData = new FormData();

		if (post) {
			formData.append("post", post);
		}

		if (images) {
			for (let i = 0; i < images.length; i++) {
				formData.append("images", images[i]);
			}
		}

		return instance
			.post(`posts`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((response) => response.data);
	},
	deletePost(postID: string) {
		return instance.delete(`posts/${postID}`).then((response) => response.data);
	},
	likePost(postID: string) {
		return instance
			.post(`posts/like/${postID}`)
			.then((response) => response.data);
	},
	unlikePost(postID: string) {
		return instance
			.delete(`posts/like/${postID}`)
			.then((response) => response.data);
	},
	editProfile(
		nickname: string | null = null,
		country: string | null = null,
		city: string | null = null
	) {
		return instance
			.put(`profile/edit`, { nickname, country, city })
			.then((response) => response.data);
	},
	editProfileImage(image: File) {
		const formData = new FormData();
		formData.append("image", image, "avatar.jpg");

		return instance
			.put(`profile/edit/avatar`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((response) => response.data);
	},
	editProfileCover(cover: File) {
		const formData = new FormData();
		formData.append("cover", cover, "cover.jpg");

		return instance
			.put(`profile/edit/cover`, formData, {
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
	getChats(
		page: number,
		pageSize: number,
		lastChatLastMessageID: string | null
	) {
		return instance
			.get(
				`messages/chats?page=${page}&count=${pageSize}` +
					(!!lastChatLastMessageID
						? `&lastChatLastMessageID=${lastChatLastMessageID}`
						: "")
			)
			.then((response) => response.data);
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
	deleteMessage(messageID: string) {
		return instance
			.delete(`messages/message/${messageID}`)
			.then((response) => response.data);
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
