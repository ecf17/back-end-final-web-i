import cartService from "./CartService.js";

class CartController {
    async getCart(req, res) {
        try {
            const userId = req.user?.id || null;
            const sessionId = req.cookies?.session_id || null;

            const cart = await cartService.getCart(userId, sessionId);

            if (!cart) {
                return res.status(404).json({
                    message: "No cart found for the user or session.",
                });
            }

            // Obtener los items del carrito si existe
            const cartItems = await cartService.getCartItems(cart.id);

            const message = userId
                ? "Cart retrieved successfully for user"
                : "Cart retrieved successfully for guest";

            res.json({
                message,
                data: {
                    cart,
                    items: cartItems,
                },
            });
        } catch (error) {
            console.error("Error retrieving cart:", error);
            res.status(500).json({ message: "Failed to retrieve cart" });
        }
    }

    async addItem(req, res) {
        const { productId, quantity } = req.body;

        try {
            const cart = req.user
                ? await cartService.ensureCart(req.user.id, null) // Usuario autenticado
                : await cartService.ensureCart(null, req.session_id); // Usuario invitado

            const cartItem = await cartService.addItemToCart(cart.id, productId, quantity);

            const response = { message: "Item added to cart", data: cartItem };
            if (!req.user) {
                response.sessionId = req.session_id;
            }

            res.json(response);
        } catch (error) {
            console.error("Error adding item to cart:", error.message);
            res.status(500).json({ message: "Failed to add item to cart" });
        }
    }

    async updateItemQuantity(req, res) {
        try {
            const { productId, quantity } = req.body;

            // Identificar el carrito según el usuario autenticado o la sesión
            const cart = req.user
                ? await cartService.ensureCart(req.user.id, null) // Usuario autenticado
                : await cartService.ensureCart(null, req.session_id); // Usuario invitado

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            await cartService.updateItemQuantityByProductId(cart.id, productId, quantity);
            res.json({ message: "Item quantity updated successfully" });
        } catch (error) {
            console.error("Error updating item quantity:", error.message);
            res.status(500).json({ message: "Failed to update item quantity", error: error.message });
        }
    }

    async deleteItem(req, res) {
        try {
            const { productId } = req.params;

            const cart = req.user
                ? await cartService.ensureCart(req.user.id, null)
                : await cartService.ensureCart(null, req.session_id);

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            await cartService.deleteItemByProductId(cart.id, productId);
            res.json({ message: "Item removed from cart successfully" });
        } catch (error) {
            console.error("Error deleting item from cart:", error.message);
            res.status(500).json({ message: "Failed to remove item from cart" });
        }
    }


}

export default new CartController();