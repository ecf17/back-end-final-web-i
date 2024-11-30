import userService from './UserService.js';
import jwt from 'jsonwebtoken';
import {handleRequest} from "../core/utils/handleRequest.js";
import {validateEmail} from "../core/utils/validationUtils.js";
import cartService from "../cart/CartService.js";

class UserController {
    async login(req, res) {
        await handleRequest(async (email, password) => {
            if (!validateEmail(email)) {
                throw new Error('Invalid email format');
            }

            const user = await userService.authenticateUser(email, password);

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const sessionId = req.cookies?.session_id;

            let userCart = await cartService.getCart(user.id, null);

            if (!userCart) {
                userCart = await cartService.ensureCart(user.id, null);
            }

            if (sessionId) {
                const sessionCart = await cartService.getCart(null, sessionId);
                if (sessionCart && sessionCart.id !== userCart.id) {
                    await cartService.mergeCarts(userCart.id, sessionCart.id);
                }
            }

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                },
            });
        }, [req.body.email, req.body.password], res);
    }

    async register(req, res) {
        await handleRequest(async (userData) => {
            if (!validateEmail(userData.email)) {
                throw new Error('Invalid email format');
            }

            const user = await userService.registerUser(userData);

            const token = jwt.sign(
                { id: user.id, role: 'customer' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return {
                message: 'Registration successful',
                token
                /*user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: 'customer',
                },*/
            };
        }, [req.body], res);
    }

    async updateProfile(req, res) {
        await handleRequest(async (userId, userData) => {
            if (userData.role && req.user.role !== 'admin') {
                throw new Error('Only administrators can change the role');
            }

            const updatedUser = await userService.updateUser(userId, userData);

            return {
                message: 'Profile updated successfully',
                user: updatedUser,
            };
        }, [req.user.id, req.body], res);
    }

    async getProfile(req, res) {
        await handleRequest(async (userId) => {
            const user = await userService.getUserById(userId);
            if (!user) throw new Error('User not found');

            return {
                message: 'User profile retrieved successfully',
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                },
            };
        }, [req.user.id], res);
    }
}

export default new UserController();
