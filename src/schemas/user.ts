import { object, string, TypeOf } from 'zod'

export const createUser = object({
	body: object({
		email: string({
			required_error: 'Email is required'
		}).email('Invalid email'),
		password: string({
			required_error: 'Password is required'
		}).min(8, 'Password must be minimum 8 chars'),
		confirm: string({
			required_error: 'Password confirmation is required'
		}),
		username: string({
			required_error: 'Username is required'
		}).regex(/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/, 'Invalid username')
	}).refine((data) => data.password === data.confirm, {
		message: 'Password do not match',
		path: ['confirm']
	})
})

export const verifyUser = object({
	query: object({
		id: string(),
		code: string()
	})
})

export const forgotPassword = object({
	body: object({
		email: string({
			required_error: 'Email is required'
		}).email('Invalid email')
	})
})

export const resetPassword = object({
	query: object({
		id: string(),
		code: string()
	}),
	body: object({
		password: string({
			required_error: 'Password is required'
		}).min(8, 'Password must be minimum 8 chars'),
		confirm: string({
			required_error: 'Password confirmation is required'
		})
	}).refine((data) => data.password === data.confirm, {
		message: 'Password do not match',
		path: ['confirm']
	})
})

export type CreateUserInput = TypeOf<typeof createUser>['body']
export type VerifyUserInput = TypeOf<typeof verifyUser>['query']
export type ForgotPasswordInput = TypeOf<typeof forgotPassword>['body']
export type ResetPasswordInput = TypeOf<typeof resetPassword>