const jwt = require('jsonwebtoken');

const getAccessToRoute = async (req, res, next) => {
    const token = await req.cookies.access_token;
    const { JWT_SECRET_KEY } = process.env;
    if (!token) {
        return res.status(401).json({ error: "You are not authorized to access this route." });
    }
    try {
        const decoded = await jwt.verify(token, JWT_SECRET_KEY);
        req.user = {
            id: decoded.id,
            name: decoded.name,
            surname: decoded.surname,
            profilePicture: decoded.profilePicture,
            role: decoded.role,
        };
        next();
    } catch (err) {
        return res.status(401).json({ error: "You are not authorized to access this route." });
    }
};


module.exports = {
    getAccessToRoute
}