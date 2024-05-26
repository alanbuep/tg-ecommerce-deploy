function authUser(req, res, next) {
    const userRole = req.session.role;
    if (!userRole) {
        return res.status(401).json({ message: "Usuario no autenticado" });
    }
    if (userRole === "user") {
        return next();
    } else {
        return res.status(403).json({ message: "Acceso denegado" });
    }
}

export default authUser;