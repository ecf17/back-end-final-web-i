import bcrypt from 'bcrypt';
import userRepository from './UserRepository.js';
import {hashPassword} from "../core/utils/hashFunction.js";

class UserService {
    async registerUser(userData) {
        try {
            const hashedPassword = await hashPassword(userData.password);

            const user = await userRepository.createUser({
                ...userData,
                password: hashedPassword,
            });

            if (!user) {
                throw new Error('User registration failed');
            }

            return user;
        } catch (error) {
            if (error.code === '23505') { // Unique constraint violation
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    async updateUser(userId, updatedData) {
        try {
            const user = await userRepository.updateUser(userId, updatedData);
            if (!user) throw new Error('User not found');
            return user;
        } catch (error) {
            throw error;
        }
    }

    async authenticateUser(email, password) {
        const user = await userRepository.getUserByEmail(email);

        if (!user) {
            throw new Error('User not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        return user;
    }

    async getUserById(userId) {
        try {
            const user = await userRepository.getUserById(userId);
            if (!user) throw new Error('User not found');
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService();
