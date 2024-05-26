import { UserModel } from "../../models/users.js";
import CustomError from "../../../services/customError.js";
import enumErrors from "../../../services/enumError.js";
import { generateFindUserErrorInfo, generateAddUserErrorInfo } from "../../../services/infoError.js";

export default class UsersDaoDb {
    constructor() {
        console.log("Working with mongoDB");
    } async getUsers() {
        let users = await UserModel.find().lean();
        return users;
    }

    async getUserById(id) {
        let user = await UserModel.findById(id);
        if (!user) {
            CustomError.createError({
                name: "Error al buscar el usuario",
                cause: generateFindUserErrorInfo(id),
                message: "Usuario no encontrado",
                code: enumErrors.FIND_USER_ERROR,
            });
        }
        return user;
    }

    async getUserByEmail(email) {
        try {
            let user = await UserModel.findOne({ email }).lean();
            if (!user) {
                CustomError.createError({
                    name: "Error al buscar el usuario",
                    cause: generateFindUserErrorInfo(email),
                    message: "Usuario no encontrado",
                    code: enumErrors.FIND_USER_ERROR,
                });
            }
            return user;
        } catch (error) {
            CustomError.createError({
                name: "Error al buscar el usuario",
                message: error.message,
                code: enumErrors.DATABASE_ERROR,
            });
        }
    }

    async checkUserByEmail(email) {
        try {
            let user = await UserModel.findOne({ email }).lean();
            return user || null;
        } catch (error) {
            CustomError.createError({
                name: "Error al buscar el usuario",
                message: error.message,
                code: enumErrors.DATABASE_ERROR,
            });
        }
    }

    async saveUser(user) {
        try {
            let newUser = new UserModel(user);
            let result = await newUser.save();
            return result;
        } catch (error) {
            CustomError.createError({
                name: "Error al agregar el usuario",
                cause: generateAddUserErrorInfo(user),
                message: error.message,
                code: enumErrors.ADD_USER_ERROR,
            });
        }
    }

    async updateUser(id, user) {
        const { _id, ...userWithoutId } = user;
        const result = await UserModel.updateOne({ _id: id }, userWithoutId);
        return result;
    }

    async deleteUser(id) {
        const result = await UserModel.findByIdAndDelete(id);
        return result;
    }
}