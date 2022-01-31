import { NextFunction, Request, Response } from 'express'
import { verifyJWT } from '../utils/jwt'

export default async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '')

	if (!accessToken) {
		return next()
	}

	const decoded = verifyJWT(accessToken, 'accessTokenPublicKey')

	if (decoded) {
		res.locals.user = decoded
	}

	return next()
}