const UserModel = require("../models/user.model.js");

class UserRepository {
    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async create(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async save(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }
    //metodo de validacion de email y password 
    async 
}

module.exports = UserRepository;
