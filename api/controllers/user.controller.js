import User from '../models/user.model.js'
import Course from '../models/course.model.js'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()

    if (!users?.length) return res.status(400).json({message: 'No user found!'})

    res.json(users)
})

const createNewUser = asyncHandler(async (req, res) => {
    const { email, password, roles } = req.body
    // @Note Change the user created by admin to set the password after first login

    // Check if data exist
    if (!email || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: 'All fields are required'})
    }

    // Check for duplicates
    const duplicate = await User.findOne({ email }).lean().exec()
    if (duplicate) return res.status(409).json({message: 'This email address is already registred'})

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
    const userObject = { email, "password": hashedPwd, roles }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${email} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { id, firstname, lastname, country, city, address, company, title, email, roles, active, password } = req.body

    // Confirm data 
    if (!id || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()
    if (!user) return res.status(400).json({ message: 'User not found' })

    // Check for duplicate 
    const duplicate = await User.findOne({ email }).lean().exec()
    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    user.firstname = firstname
    user.lastname = lastname
    user.country = country
    user.city = city
    user.address = address
    user.company = company
    user.title = title
    user.email = email
    user.roles = roles
    user.active = active

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.email} updated` })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned notes?
    const course = await Course.findOne({ user: id }).lean().exec()
    if (course) {
        return res.status(400).json({ message: 'User has assigned courses' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `User ${result.email} with ID ${result._id} was deleted`

    res.json(reply)
})

export default { getAllUsers, createNewUser, updateUser, deleteUser }