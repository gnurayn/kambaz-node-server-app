import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
    try {
        console.log("JWT AUTHENTICATE");

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("No Bearer token");
            return res.status(401).json({ message: "Authentication required" });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        console.log("Token valid - User:", decoded.username, "Role:", decoded.role);

        req.currentUser = {
            _id: decoded.userId,
            username: decoded.username,
            role: decoded.role
        };

        if (!req.session) req.session = {};
        req.session["currentUser"] = req.currentUser;

        next();
    } catch (error) {
        console.log("Token invalid:", error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const canEditCourse = (req, res, next) => {
    const currentUser = req.currentUser || req.session?.["currentUser"];

    console.log("Can edit check - Role:", currentUser?.role);

    if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (!['FACULTY', 'ADMIN'].includes(currentUser.role)) {
        console.log("Role denied:", currentUser.role);
        return res.status(403).json({
            message: "Only Faculty and Admin can edit courses"
        });
    }

    console.log("Edit permission granted");
    next();
};