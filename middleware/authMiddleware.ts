import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";

export interface IGetUserAuthRequest extends Request {
	user?: jwt.JwtPayload;
}

export default (
	req: IGetUserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	if (req.method === "OPTIONS") {
		return next();
	}
	try {
		const token = req.cookies.token;
		if (!token) {
			return res
				.status(401)
				.json({ success: false, statusText: "User not auth" });
		}

		const decoded = jwt.verify(token, config.get("jwtSecret"));
		req.user = decoded as jwt.JwtPayload;
		next();
	} catch (e) {
		res.status(401).json({ success: false, statusText: "User not auth" });
	}
};
