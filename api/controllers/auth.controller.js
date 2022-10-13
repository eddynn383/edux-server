import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'

// SIGN UP
const register = asyncHandler( async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) return res.status(400).json({message: "Email and password are required."})
    
    // Check if the email is already registered
    const duplicate = await User.findOne({ email }).exec()
    if (duplicate) return res.status(409).json({message: 'This email address is already registred'}) // Conflict

    try {
        // Encrypt the password
        const hash = await bcrypt.hash(password, 10)

        // Create and store the new user
        const newUser = await User.create({...req.body, password: hash})

        await newUser.save()
        res.status(201).json({success: `New user ${email} has been created!`})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// SIGN IN
const login = asyncHandler( async (req, res) => {
    const { email, password } = req.body

    if(!email || !password) return res.status(400).json({message: 'All fields are required'})

    const foundUser = await User.findOne({ email }).exec()
    if (!foundUser || !foundUser.active) return res.status(401).json({message: "Unauthorized"})

    const match = await bcrypt.compare(password, foundUser.password)
    if(!match) return res.status(400).json("Passoword don't match")

    console.log(foundUser)
    
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "avatar": foundUser.avatar,
                "firstname": foundUser.firstname,
                "lastname": foundUser.lastname,
                "email": foundUser.email,
                "roles": foundUser.roles
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email }, 
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie("jwt", refreshToken, {
        httpOnly: true, // Accessible only by web server 
        secure: true, // Https
        sameSite: 'None', // Cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiry: set to match rT
    })

    // Send accessToken containing email and roles 
    res.json({ accessToken })
})

const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email: decoded.email }).exec()

            if (!foundUser) return res.status(401).json({ message: 'User not found' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "avatar": foundUser.avatar,
                        "firstname": foundUser.firstname,
                        "lastname": foundUser.lastname,
                        "email": foundUser.email,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

const signout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

export default { register, login, signout, refresh }