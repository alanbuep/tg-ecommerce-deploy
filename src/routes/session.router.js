import { Router } from "express";
import auth from "../middlewares/auth.js";
import passport from "passport";
import { passportCall, authorization } from "../utils.js";
import authUser from "../middlewares/authUser.js";
import { mailRestore } from "../services/mail/restore.password.js";
import { failRegister, getForgot, githubcallback, login, logout, postForgot, realtime, resetpassword, restorepassword, signup } from "../controller/session.controller.js";

const router = Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubcallback);

router.post("/login", login);

router.post("/signup", passport.authenticate("register", { failureRedirect: "/failRegister", }), signup);

router.get("/current", passportCall("jwt"), authorization("admin"), (req, res) => { res.status(200).json(req.user); });

router.get("/failRegister", failRegister);

router.get("/realtime", auth, realtime);

router.get("/forgot", getForgot);

router.get("/restorepasswordemail", authUser, mailRestore);

router.get("/restorepassword", restorepassword);

router.put("/resetpassword", resetpassword);

router.post("/forgot", postForgot);

router.get('/logout', logout);

export default router;