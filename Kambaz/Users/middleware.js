export const authenticate = (req, res, next) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
    }
    next();
};

export const canEditCourse = (req, res, next) => {
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (!['FACULTY', 'ADMIN'].includes(currentUser.role)) {
        return res.status(403).json({
            message: "Only Faculty and Admin can edit courses"
        });
    }

    next();
};