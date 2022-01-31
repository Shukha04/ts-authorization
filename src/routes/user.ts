import express from 'express'
import {
	createUserHandler,
	forgotPasswordHandler,
	getCurrentUserHandler,
	resetPasswordHandler,
	verifyUserHandler
} from '../controllers/user'
import requireUser from '../middleware/requireUser'
import validation from '../middleware/validation'
import { createUser, forgotPassword, resetPassword, verifyUser } from '../schemas/user'

const router = express.Router()

router.post('/api/user/register', validation(createUser), createUserHandler)
router.get('/api/user/verify', validation(verifyUser), verifyUserHandler)
router.post('/api/user/forgot', validation(forgotPassword), forgotPasswordHandler)
router.post('/api/user/reset', validation(resetPassword), resetPasswordHandler)
router.get('/api/user/me', requireUser, getCurrentUserHandler)

export default router