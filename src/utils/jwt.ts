import config from 'config'
import jwt, { SignOptions } from 'jsonwebtoken'

export function signJWT(object: Object, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', options?: SignOptions | undefined) {
	const signInKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')

	return jwt.sign(object, signInKey, {
		...(options && options),
		algorithm: 'RS256'
	})
}

export function verifyJWT<T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): T | null {
	const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')

	try {
		return jwt.verify(token, publicKey) as T
	} catch (err) {
		return null
	}
}