require('dotenv').config()

import express from 'express'
import config from 'config'
import deserialize from './middleware/deserialize'
import routes from './routes'
import connect from './utils/connect'
import logger from './utils/logger'

const port = config.get('port')

const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use(deserialize)

app.use(routes)

app.listen(port, async () => {
	logger.info(`Server is running at http://localhost:${ port }`)

	await connect()
})