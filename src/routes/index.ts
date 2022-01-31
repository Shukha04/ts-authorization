import express from 'express'
import auth from './auth'
import user from './user'

const router = express.Router()

router.use(user)
router.use(auth)

export default router