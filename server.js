import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'

import connectDB from './config/dbConnect.js'
import corsOptions from './config/corsOptions.js'

import { logEvents, logger } from './api/middlewares/logger.mw.js';
import errorHandler from './api/middlewares/error.mw.js'

import authRoute from './api/routes/auth.route.js'
import usersRoute from './api/routes/users.route.js'
import coursesRoute from './api/routes/courses.route.js'
import themesRoute from './api/routes/themes.route.js'
import rootRoute from './api/routes/root.route.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express() 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB()

// Custom middleware logger
app.use(logger)

// Cross origin Resource Sharing
app.use(cors(corsOptions))

// Build-in middleware to accept json
app.use(express.json())

// Middleware for cookies
app.use(cookieParser())

// Serve static files
app.use('/', express.static(path.join(__dirname, 'public')));


app.use('/', rootRoute)
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/users", usersRoute)
app.use("/api/v1/courses", coursesRoute)
app.use("/api/v1/themes", themesRoute)

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message: '404 Not found!'})
    } else {
        res.type('text').send('404 Not found!')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrors.log')
})
