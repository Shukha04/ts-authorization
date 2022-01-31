import mongoose from 'mongoose'
import config from 'config'
import logger from './logger'

export default async function () {
	const uri = config.get<string>('database')

	try {
		await mongoose.connect(uri)
		logger.info('Connected to database')
	} catch (err) {
		logger.error('')
		process.exit(1)
	}
}