import express from 'express'
import courseCTRL from '../controllers/course.controller.js'
import verifyJWT from '../middlewares/verifyJWT.mw.js'

const router = express.Router()

router.use(verifyJWT)

router.route('/')
.get(courseCTRL.getAllCourses)
.post(courseCTRL.createNewCourse)
.patch(courseCTRL.updateCourse)
.delete(courseCTRL.deleteCourse)

export default router