import utils from "../../../utils.js";
import crypto from "crypto";

export class UserDaoFs {
    constructor(path) {
        this.path = path;
        this.users = [];
    }

    async addUser(first_name, last_name, email, password, birth, role, cart, documents, last_connection) {
        if (!first_name || !last_name || !email || !password || !birth || !role) {
            throw new Error("All fields except cart, documents, and last_connection are required");
        }

        try {
            let data = await utils.readFile(this.path);
            this.users = data?.length > 0 ? data : [];
        } catch (error) {
            throw error;
        }

        const validateEmail = this.users.some(user => user.email === email);
        if (validateEmail) {
            throw new Error("The email is already registered");
        } else {
            const newUser = {
                id: crypto.randomUUID(),
                first_name,
                last_name,
                email,
                password,
                birth,
                role,
                cart: cart || null,
                documents: documents || [],
                last_connection: last_connection || null,
            };
            this.users.push(newUser);
            try {
                await utils.writeFile(this.path, this.users);
                return newUser;
            } catch (error) {
                throw error;
            }
        }
    }

    async getUsers() {
        try {
            let data = await utils.readFile(this.path);
            this.users = data;
            return data?.length > 0 ? this.users : "No users found";
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            let users = await this.getUsers();
            const userFound = users.find(user => user.id === id);
            if (userFound) {
                return userFound;
            } else {
                return "User not found";
            }
        } catch (error) {
            throw new Error('Error fetching user by ID: ' + error.message);
        }
    }

    async updateUser(id, data) {
        try {
            let users = await this.getUsers();
            let index = users.findIndex(user => user.id === id);
            if (index !== -1) {
                this.users[index] = {
                    ...this.users[index],
                    ...data,
                };
                await utils.writeFile(this.path, users);
                return {
                    message: "User updated successfully",
                    user: this.users[index],
                };
            } else {
                return "User not found";
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            let users = await this.getUsers();
            let index = users.findIndex(user => user.id === id);
            if (index !== -1) {
                let user = this.users[index];
                this.users.splice(index, 1);
                await utils.writeFile(this.path, this.users);
                return {
                    message: "User deleted successfully",
                    user: user,
                };
            } else {
                return "User not found";
            }
        } catch (error) {
            throw error;
        }
    }
}

export default { UserDaoFs };