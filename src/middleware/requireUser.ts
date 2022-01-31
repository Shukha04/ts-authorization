import { NextFunction, Request, Response } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
	const user = res.locals.user

	if (!user) {
		return res.status(403)
	}

	return next()
}