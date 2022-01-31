import { object, string, TypeOf } from 'zod'

export const createSession = object({
	body: object({
		identifier: string({
			required_error: 'Email is required'
		}).email('Invalid email'),
		password: string({
			required_error: 'Password is required'
		}).min(8, 'Password must be minimum 8 chars')
	})
})

export type createSessionInput = TypeOf<typeof createSession>['body']