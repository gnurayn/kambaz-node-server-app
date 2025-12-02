export const authenticate = (req, res, next) => {
    console.log("==========================================");
    console.log("🔍 AUTHENTICATE MIDDLEWARE");
    console.log("🔍 Request URL:", req.url);
    console.log("🔍 Request Method:", req.method);
    console.log("🔍 Session exists?", !!req.session);
    console.log("🔍 Session ID:", req.sessionID);
    console.log("🔍 Full session:", JSON.stringify(req.session, null, 2));
    console.log("🔍 currentUser:", req.session["currentUser"]);
    console.log("==========================================");

    const currentUser = req.session["currentUser"];

    if (!currentUser) {
        console.log("❌ BLOCKING: No currentUser in session");
        return res.status(401).json({ message: "Authentication required" });
    }

    console.log("✅ PASSING: User authenticated -", currentUser.username);
    next();
};

export const canEditCourse = (req, res, next) => {
    console.log("==========================================");
    console.log("🔍 CAN EDIT COURSE MIDDLEWARE");
    const currentUser = req.session["currentUser"];
    console.log("🔍 currentUser:", currentUser);
    console.log("🔍 Role:", currentUser?.role);
    console.log("🔍 Role type:", typeof currentUser?.role);
    console.log("==========================================");

    if (!currentUser) {
        console.log("❌ BLOCKING: No user");
        return res.status(401).json({ message: "Authentication required" });
    }

    if (!['FACULTY', 'ADMIN'].includes(currentUser.role)) {
        console.log("❌ BLOCKING: Role not allowed -", currentUser.role);
        return res.status(403).json({
            message: "Only Faculty and Admin can edit courses"
        });
    }

    console.log("✅ PASSING: User can edit courses");
    next();
};