import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("signup", {
        title: "Crea tu cuenta",
        style: "css/styles.css",
        scriptName: "signup.js",
    });
});

export default router;