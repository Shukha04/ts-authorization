import config from 'config'
import dayjs from 'dayjs'
import pino from 'pino'

const level = config.get<string>('logLevel')

export default pino({
	transport: {
		target: 'pino-pretty'
	},
	level,
	base: {
		pid: false
	},
	timestamp: () => `, "time": "${ dayjs().format() }"`
})