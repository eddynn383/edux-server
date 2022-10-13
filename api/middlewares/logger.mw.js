import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'


const fsPromise = fs.promises
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'dd•MMM•yyyy\t[HH:mm:ss]')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '../../', 'logs'))) {
            await fsPromise.mkdir(path.join(__dirname, '../../', 'logs'))
        }

        await fsPromise.appendFile(path.join(__dirname, '../../', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

export const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'request.log')
    console.log(`${req.method} ${req.path}`)
    // console.log(`Event header return ${req.headers.origin}`)
    next()
}