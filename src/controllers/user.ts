import { Request, Response } from 'express'
import { nanoid } from 'nanoid'
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schemas/user'
import { createUser, findUserByEmail, findUserById } from '../services/user'
import logger from '../utils/logger'
import sendEmail from '../utils/mailer'

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
	const body = req.body

	try {
		const user = await createUser(body)

		await sendEmail({
			to: user.email,
			from: 'test@example.com',
			subject: 'Please verify your account',
			text: `Verification code ${ user.verificationCode }. ID: ${ user._id }`
		})

		return res.send('User successfully created')
	} catch (err: any) {
		if (err.code === 11000) {
			return res.status(409).send('Account already exists')
		}

		return res.status(500).send(err)
	}
}

export async function verifyUserHandler(req: Request<{}, {}, {}, VerifyUserInput>, res: Response) {
	const id = req.query.id
	const code = req.query.code

	const user = await findUserById(id)

	if (!user) {
		return res.send('Could not verify user')
	}

	if (user.verified) {
		return res.send('User is already verified')
	}

	if (user.verificationCode === code) {
		user.verified = true

		await user.save()

		return res.send('User successfully verified')
	}

	return res.send('Could not verify user')
}

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
	const message = 'If user with that email is registered you will receive a password reset email'

	const { email } = req.body

	const user = await findUserByEmail(email)

	if (!user) {
		logger.debug('Email is not registered')
		return res.send(message)
	}

	if (!user.verified) {
		return res.send('User is not verified')
	}

	user.resetCode = nanoid()

	await user.save()

	await sendEmail({
		to: user.email,
		from: 'test@example.com',
		subject: 'Reset your password',
		text: `Password reset code ${ user.resetCode }. ID: ${ user._id }`
	})

	logger.debug('Email sent')
	return res.send(message)
}

export async function resetPasswordHandler(req: Request<{}, {}, ResetPasswordInput['body'], ResetPasswordInput['query']>, res: Response) {
	const { id, code } = req.query
	const { password } = req.body

	const user = await findUserById(id)

	if (!user || !user.resetCode || user.resetCode !== code) {
		return res.status(400).send('Could not reset user password')
	}

	user.resetCode = null

	user.password = password

	await user.save()

	return res.send('Successfully reset password')
}

export async function getCurrentUserHandler(req: Request, res: Response) {
	return res.send(res.locals.user)
}