import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from './User'

export class Session {
	@prop({ ref: () => User })
	user: Ref<User>

	@prop({ default: true })
	valid: boolean
}

export default getModelForClass(Session, {
	schemaOptions: {
		timestamps: true
	}
})