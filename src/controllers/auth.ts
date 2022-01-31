import { Request, Response } from 'express'
import { get } from 'lodash'
import { createSessionInput } from '../schemas/auth'
import { findSessionById, signAccessToken, signRefreshToken } from '../services/auth'
import { findUserByEmail, findUserById } from '../services/user'
import { verifyJWT } from '../utils/jwt'

export async function createSessionHandler(req: Request<{}, {}, createSessionInput>, res: Response) {
	const { identifier, password } = req.body

	const user = await findUserByEmail(identifier)

	if (!user) {
		return res.send('Invalid email')
	}

	if (!user.verified) {
		return res.send('Please verify your email')
	}

	const isValid = await user.comparePassword(password)

	if (!isValid) {
		return res.send('Wrong credentials')
	}

	const accessToken = signAccessToken(user)
	const refreshToken = await signRefreshToken({ userId: user._id })

	return res.send({ accessToken, refreshToken })
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
	const refreshToken = get(req, 'headers.x-refresh')

	const decoded = verifyJWT<{ session: string }>(refreshToken, 'refreshTokenPublicKey')

	if (!decoded) {
		return res.status(401).send('Could not refresh access token')
	}

	const session = await findSessionById(decoded.session)

	if (!session || !session.valid) {
		return res.status(401).send('Could not refresh access token')
	}

	const user = await findUserById(String(session.user))

	if (!user) {
		return res.status(401).send('Could not refresh access token')
	}

	const accessToken = signAccessToken(user)

	return res.send({ accessToken })
}