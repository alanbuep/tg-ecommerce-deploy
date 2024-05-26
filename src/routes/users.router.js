import { Router } from "express";
import multer from "multer";
import { __dirname } from "../utils.js";
import { changeToPremium, getUsers, uploadDocs, checkUserCart, deleteInactiveUsers } from "../controller/users.controller.js";
import authUser from "../middlewares/authUser.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/docs/profileImage');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

router.get("/", getUsers);

router.get("/check-cart", authUser, checkUserCart);

router.put("/premium/:uid", changeToPremium);

router.post("/:uid/documents", upload.single("document"), uploadDocs);

router.delete("/delete-inactive-users", deleteInactiveUsers);

export default router;