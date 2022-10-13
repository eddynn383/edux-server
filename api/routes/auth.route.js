import express from 'express'
import authCTRL from '../controllers/auth.controller.js'
import loginLimiter from '../middlewares/loginLimiter.mw.js'

const router = express.Router()

// REGISTER A USER
router.route("/register").post(authCTRL.register)

// LOGIN A USER
router.route("/login").post(loginLimiter, authCTRL.login)

// REFRESH TOKEN
router.route("/refresh").get(authCTRL.refresh)

// LOGOUT
router.route('/logout').post(authCTRL.signout)

export default router