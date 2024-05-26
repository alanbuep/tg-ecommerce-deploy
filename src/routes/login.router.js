import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("login", {
        title: "Inicia sesión",
        style: "css/styles.css",
        scriptName: "login.js",
    });
});

export default router;