import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../features/v1/auth/services/jwt.services";

export const deserializeUser = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const accessToken = (req.headers.authorization || "").replace(
		/^Bearer\s/,
		"",
	);

	if (!accessToken) {
		return next();
	}

	const decoded = verifyJwt(accessToken, "accessTokenPublic");
	if (decoded) {
		res.locals.user = decoded;
	}

	return next();
};
