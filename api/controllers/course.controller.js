import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'
import Course from '../models/course.model.js'


const getAllCourses = asyncHandler( async (req, res) => {
    // Get all courses
    const courses = await Course.find().lean()

    if (!courses?.length) {
        return res.status(400).json({message: 'No courses found!'})
    }

    const coursesWithUser = await Promise.all(courses.map( async (course) => {
        const user = await User.findById(course.user).lean().exec()
        return {...course, email: user.email}
    }))

    res.json(coursesWithUser)
})

const createNewCourse = asyncHandler( async (req, res) => {
    const { user, title, desc, cover, language, price, rating, tutor, isBestseller, status, metatags, content } = req.body 

    // Check if data is provided
    if (!user || !title || !content) return res.status(400).json({ message: 'All fields are required' })

    // Check for duplicate title
    const duplicate = await Course.findOne({ title }).lean().exec()
    if (duplicate) return res.status(409).json({ message: 'Duplicate course title' })
    

    const course = await Course.create({ creatorID, title, desc, cover, language, price, rating, tutor, isBestseller, status, metatags, content })

    if (course) {
        return res.status(201).json({ message: 'New course was created!'})
    } else {
        return res.status(400).json({ message: 'Something went wrong!' })
    }
})

const updateCourse = asyncHandler( async (req, res) => {
    const { id, user, title, content, completed } = req.body

    // Confirm data
    if (!id || !user || !title || !content || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exists to update
    const course = await Course.findById(id).exec()

    if (!course) {
        return res.status(400).json({ message: 'Course not found' })
    }

    // Check for duplicate title
    const duplicate = await Course.findOne({ title }).lean().exec()

    // Allow renaming of the original course 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate course title' })
    }

    course.user = user
    course.title = title
    course.text = content
    course.completed = completed

    const updatedCourse = await course.save()

    res.json(`'${updatedCourse.title}' updated`)
})

const deleteCourse = asyncHandler( async (req, res) => {
    const { id } = req.body
    
    if (!id) return res.status(400).json({message: 'Course ID is required'})

    // Confirm note exists to delete 
    const course = await Course.findById(id).exec()

    if (!course) {
        return res.status(400).json({ message: 'Course not found' })
    }

    const result = await course.deleteOne()

    const reply = `Course '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

export default { createNewCourse, updateCourse, getAllCourses, deleteCourse }