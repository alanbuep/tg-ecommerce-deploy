function authSave(req, res, next) {
    const userRole = req.session.role;
    if (!userRole) {
        return next();
    }
    if (userRole === "admin") {
        return next();
    } else if (userRole === "premium") {
        return next();
    } else {
        return res.sendStatus(403);
    }
}

export default authSave;