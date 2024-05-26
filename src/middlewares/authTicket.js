function authTicket(req, res, next) {
    console.log(req.session)
    const user = req.session.user;
    console.log(user)
    if (!user) {
        return res.sendStatus(401);
    }
    if (user) {
        console.log( "Auth create ticket: " + user);
        req.user = user;
        return next();
    } else {
        return res.sendStatus(403);
    }
}

export default authTicket;