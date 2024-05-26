import { usersDao } from "../dao/index.dao.js";
import { createHash, isValidPassword } from "../utils.js";
import { generateToken } from "../utils.js";

async function githubcallback(req, res) {
    req.session.user = req.user;
    req.session.admin = true;
    res.redirect("/products");
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);
        if (!email || !password) {
            res.status(400).json({ error: "Faltan datos" });
        } else {
            const user = await usersDao.getUserByEmail(email);
            console.log(user)
            if (user === null) {
                res.status(400).json({
                    error: "Usuario o contraseña incorrectos",
                });
            } else {

                const isMatch = isValidPassword(user.password, password);
                if (!isMatch) {
                    res.status(401).json({
                        error: "Contraseña incorrecta",

                    });
                } else {
                    const myToken = generateToken({ email });
                    console.log(myToken);
                    req.session.user = email;
                    req.session.role = user.role;
                    res
                        .cookie("TG_CookieToken", myToken, {
                            maxAge: 60 * 60 * 1000,
                            httpOnly: true,
                        })
                        .status(200)
                        .json({ status: "success", token: myToken, respuesta: user.role === 'admin' ? 'admin' : 'ok', });
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

async function signup(req, res) {
    res.status(201).json({
        respuesta: "Usuario creado con éxito",
        redirectUrl: "/login"
    });
}

async function failRegister(req, res) {
    res.status(400).json({
        error: "Error al crear el usuario",
    });
}

async function realtime(req, res) {
    res.render("realtime", {
        title: "Administrador de Productos",
        user: req.session.user,
    });
}

async function getForgot(req, res) {
    res.render("forgot", {
        title: "forgot",
        style: "css/styles.css",
        scriptName: "forgot.js"
    })
}

async function restorepassword(req, res) {
    const user = req.session.user;
    const { timestamp } = req.query;
    try {
        const linkTimestamp = parseInt(timestamp, 10);
        const now = Date.now();
        const expirationTime = 60 * 60 * 1000;
        const timeDifference = now - linkTimestamp;

        if (timeDifference > expirationTime) {
            return res.redirect("/login");
        }
        res.render("restore", {
            title: "restore",
            style: "css/styles.css",
            scriptName: "restore.js",
            user: user,
        })
    } catch (error) {
        console.error("Error al verificar el enlace:", error);
        res.status(400).json({ status: "error", message: "El enlace ha expirado" });
    }
}

async function resetpassword(req, res) {
    try {
        console.log(req.session)
        const email = req.session.user;
        console.log(email)
        const user = await usersDao.getUserByEmail(email);
        console.log(user)
        console.log(req.body.currentPassword)
        console.log(req.body.newPassword)
        if (user) {
            const isMatch = isValidPassword(user.password, req.body.currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Contraseña incorrecta" });
            }
            user.password = createHash(req.body.newPassword);
            await usersDao.updateUser(user._id, user)
            res.status(201).json({ status: "success", message: "Contraseña cambiada con éxito" });
        } else {
            res.status(500).json({ message: "Error con el usuario al cambiar la contraseña" });
        }
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).json({ message: "Error al cambiar la contraseña" });
    }
}

async function postForgot(req, res) {
    try {
        const { email, newPassword } = req.body;
        const user = await usersDao.getUserByEmail(email);
        if (user.length === 0 && newPassword.length === 0) {
            return res.status(401).json({
                error: "Usuario o contraseña incorrectos",
            });
        } else {
            const password = createHash(newPassword);
            user.password = password;
            const result = usersDao.updateUser(user._id, user)
            res.status(200).json({
                respuesta: "ok",
                datos: result,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
}

async function logout(req, res) {
    try {
        const { user } = req.session;
        console.log(user);
        const checkUser = await usersDao.getUserByEmail(user);
        if (!checkUser) {
            console.log("Usuario no encontrado");
        } else {
            checkUser.last_connection = new Date();
            await usersDao.updateUser(checkUser._id, checkUser)
            console.log("last_connection actualizada");
        }
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
}

export { githubcallback, login, signup, failRegister, realtime, getForgot, restorepassword, resetpassword, postForgot, logout };