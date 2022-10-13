import express from 'express'
import userCTRL from '../controllers/user.controller.js'

const router = express.Router()

router.route('/')
.get(userCTRL.getAllUsers) // GET ALL USERS
.post(userCTRL.createNewUser) // CREATE A USER
.patch(userCTRL.updateUser) // UPDATE A USER
.delete(userCTRL.deleteUser) // DELETE A USER

export default router