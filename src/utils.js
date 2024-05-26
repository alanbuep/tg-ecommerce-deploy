import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.CODERSECRET;

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
    return token;
};

export const generateTokenLink = (user) => {
    const timestamp = Date.now();
    const payload = { user, timestamp };
    const token = jwt.sign(payload, PRIVATE_KEY);
    return token;
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error);
            if (!user) {
                return res.status(401).json({
                    error: info.messages ? info.messages : info.toString(),
                });
            }
            user.role = "admin";
            req.user = user;
            next();
        })(req, res, next);
    };
};

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "Unauthorized" });
        if (req.user.role != role)
            return res.status(403).send({ error: "No permissions " });
        next();
    };
};

export const isValidPassword = (savedPassword, password) => {
    console.log(savedPassword);
    console.log(bcrypt.hashSync(password, bcrypt.genSaltSync(10)));

    return bcrypt.compareSync(password, savedPassword);
};

async function readFile(file) {
    try {
        let result = await fs.promises.readFile(__dirname + "/" + file, "utf-8");
        let data = await JSON.parse(result);
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function writeFile(file, data) {
    try {
        await fs.promises.writeFile(__dirname + "/" + file, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
    }
}

async function deleteFile(file) {
    try {
        await fs.promises.unlink(__dirname + "/" + file);
        return true;
    } catch (error) {
        console.log(error);
    }
}

export default {
    readFile,
    writeFile,
    deleteFile,
};