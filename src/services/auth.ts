import { DocumentType } from '@typegoose/typegoose'
import { omit } from 'lodash'
import { privateFields, User } from '../models/User'
import { signJWT } from '../utils/jwt'
import SessionModel from '../models/Session'

export async function createSession({ userId }: { userId: string }) {
	return SessionModel.create({ user: userId })
}

export async function findSessionById(sessionId: string) {
	return SessionModel.findById(sessionId)
}

export async function signRefreshToken({ userId }: { userId: string }) {
	const session = await createSession({ userId })

	return signJWT({ session: session._id }, 'refreshTokenPrivateKey', {
		expiresIn: '1y'
	})
}

export function signAccessToken(user: DocumentType<User>) {
	const payload = omit(user.toJSON(), privateFields)

	return signJWT({ ...payload }, 'accessTokenPrivateKey', {
		expiresIn: '15m'
	})
}