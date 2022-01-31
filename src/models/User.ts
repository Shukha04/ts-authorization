import { DocumentType, getModelForClass, index, modelOptions, pre, prop, Severity } from '@typegoose/typegoose'
import argon2 from 'argon2'
import { nanoid } from 'nanoid'

@pre<User>('save', async function (this: DocumentType<User>) {
	if (!this.isModified('password')) {
		return
	}

	this.password = await argon2.hash(this.password)

	return
})

@index({ email: 1, username: 1 })

@modelOptions({
	schemaOptions: {
		timestamps: true
	},
	options: {
		allowMixed: Severity.ALLOW
	}
})

export class User {
	@prop({ lowercase: true, required: true, unique: true })
	email: string

	@prop({ lowercase: true, required: true, unique: true })
	username: string

	@prop({ required: true })
	password: string

	@prop({ default: () => nanoid() })
	verificationCode: string

	@prop({})
	resetCode: string | null

	@prop({ default: false })
	verified: boolean

	public async comparePassword(this: DocumentType<User>, password: string) {
		return await argon2.verify(this.password, password)
	}
}

export const privateFields = [
	'password',
	'__v',
	'verificationCode',
	'resetCode',
	'verified'
]

export default getModelForClass(User)