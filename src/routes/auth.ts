import express from 'express'
import { createSessionHandler, refreshAccessTokenHandler } from '../controllers/auth'
import validation from '../middleware/validation'
import { createSession } from '../schemas/auth'

const router = express.Router()

router.post('/api/auth/login', validation(createSession), createSessionHandler)
router.post('/api/auth/refresh', refreshAccessTokenHandler)

export default router