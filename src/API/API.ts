import axios from "axios";

const instance = axios.create({
	withCredentials: true,

	baseURL: "http://localhost/api/",
	headers: {
		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	},
});

export const API = {
	// auth
	authMe() {
		return instance.get(`auth/me`).then((response) => response.data);
	},
	login(phoneNumber: string, password: string) {
		return instance
			.post(`login`, { phoneNumber, password })
			.then((response) => response.data);
	},
	register(
		phoneNumber: string,
		password: string,
		firstName: string,
		lastName: string
	) {
		return instance
			.post(`register`, { phoneNumber, password, firstName, lastName })
			.then((response) => response.data);
	},
	logout() {
		return instance.delete(`auth/me`).then((response) => response.data);
	},

	// profile
	getProfile(userID: string) {
		return instance.get(`profile/${userID}`).then((response) => response.data);
	},
	getPosts(userID: string, page: number, pageSize: number) {
		return instance
			.get(`posts/${userID}?page=${page}&count=${pageSize}`)
			.then((response) => response.data);
	},
	addPost(post: string) {
		return instance
			.post(`post/add`, { post })
			.then((response) => response.data);
	},
	likePost(userID: string, postID: number) {
		return instance
			.post(`post/like/${userID}/${postID}`)
			.then((response) => response.data);
	},
	unlikePost(userID: string, postID: number) {
		return instance
			.delete(`post/like/${userID}/${postID}`)
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
	getFriends(userID: string, category: string, page: number, pageSize: number) {
		return instance
			.get(
				`friends/${userID}?category=${category}&page=${page}&count=${pageSize}`
			)
			.then((response) => response.data);
	},

	// users
	getUsers(page: number, pageSize: number) {
		return instance
			.get(`users?page=${page}&count=${pageSize}`)
			.then((response) => response.data);
	},
	followUser(userID: string) {
		return instance.post(`follow/${userID}`).then((response) => response.data);
	},
	unfollowUser(userID: string) {
		return instance
			.delete(`follow/${userID}`)
			.then((response) => response.data);
	},
};
