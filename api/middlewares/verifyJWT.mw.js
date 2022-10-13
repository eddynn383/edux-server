import jwt from 'jsonwebtoken'

const verifyJWT = (req, res, next) => {
    console.log(process.env.ACCESS_TOKEN_SECRET)
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.user = decoded.UserInfo.email
            req.roles = decoded.UserInfo.roles
            next()
        }
    )
}

export default verifyJWT