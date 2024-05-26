import { usersDao } from "../dao/index.dao.js";
import { cartsDao } from "../dao/index.dao.js";
import { sendUserDeleted } from "../services/mail/sendUserDeleted.js";

async function getUsers() {
    try {
        const users = await usersDao.getUsers();
        if (!users) {
            console.log("Usuarios no encontrado");
        } else {
            res.status(200).json({ message: "Lista de ususarios", data: users });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
}

async function checkUserCart(req, res) {
    try {
        const { user } = req.session;
        console.log(user)

        if (!user) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const result = await usersDao.getUserByEmail(user);
        if (result && result.cart) {
            return res.status(200).json({ hasCart: true, cartId: result.cart });
        } else {
            return res.status(200).json({ hasCart: false });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
}

async function changeToPremium() {
    try {
        const { uid } = req.params;
        console.log(uid);
        let result;
        const user = await usersDao.getUserById(uid);
        if (!user) {
            console.log("Usuario no encontrado");
        } else {
            const hasRequiredDocuments =
                user.documents &&
                user.documents.length >= 3 &&
                user.documents.some((doc) =>
                    ["Identificación", "Comprobante de domicilio", "Comprobante de estado de cuenta"].includes(doc.name)
                );
            if (hasRequiredDocuments) {
                user.role = "premium";
                result = await usersDao.updateUser(user._id, user);
                console.log("El nuevo rol: ", result.role);
                res.status(200).json({ message: "Rol cambiado a premium", data: result });
            } else {
                console.log("No se han cargado todos los documentos requeridos");
                res.status(400).json({ message: "No cumples con los requisitos para ser premium o no se han cargado todos los documentos requeridos" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error
        });
    }
}

async function uploadDocs() {
    try {
        const { uid } = req.params;
        const user = await usersDao.getUserById(uid);
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const { originalname, path } = req.file;
        const newDocument = {
            name: originalname,
            reference: path,
        };
        user.documents.push(newDocument);

        const result = await usersDao.updateUser(user._id, user);

        if (!result) {
            return res.status(500).json({ message: "Error al subir el documento" });
        }

        res.status(200).json({ message: "Documento subido correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error,
        });
    }
}

async function deleteInactiveUsers(req, res) {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const allUsers = await usersDao.getUsers();

        const inactiveUsers = allUsers.filter(user => new Date(user.last_connection) < oneMonthAgo);

        for (const user of inactiveUsers) {
            await usersDao.deleteUser(user._id);
            console.log(`Usuario eliminado: ${user.email}`);
            await sendUserDeleted(user.email);
        }

        console.log("Usuarios inactivos eliminados correctamente.");

        res.status(200).json({
            success: true,
            message: "Usuarios inactivos eliminados correctamente.",
            data: inactiveUsers,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            data: error,
        });
    }
}

export { getUsers, changeToPremium, uploadDocs, checkUserCart, deleteInactiveUsers }