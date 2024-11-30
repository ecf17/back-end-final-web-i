import cartRepository from "./CartRepository.js";
import productRepository from "../product/ProductRepository.js";

class CartService {
    async getCart(userId, sessionId) {
        if (userId) {
            return await cartRepository.getCartByUserId(userId);
        }
        if (sessionId) {
            return await cartRepository.getCartBySessionId(sessionId);
        }
        return null;
    }

    async ensureCart(userId, sessionId) {
        let cart = await this.getCart(userId, sessionId);
        if (!cart) {
            cart = await cartRepository.createCart({ userId, sessionId });
        }
        return cart;
    }

    async addItemToCart(cartId, productId, quantity) {
        console.log("Adding item to cart");
        console.log("Cart ID:", cartId);
        console.log("Product ID:", productId);

        const product = await productRepository.getProductById(productId);
        if (!product) {
            console.error(`Product not found for ID: ${productId}`);
            throw new Error("Product not found");
        }

        console.log("Product found:", product);

        const subtotal = quantity * product.price;
        const cartItem = await cartRepository.addItemToCart(cartId, productId, quantity, subtotal);

        await cartRepository.updateCartTotal(cartId);
        return cartItem;
    }

    async deleteCartItem(cartItemId, cartId) {
        await cartRepository.deleteCartItem(cartItemId);
        await cartRepository.updateCartTotal(cartId);
    }

    async mergeCarts(userCartId, sessionCartId) {
        const sessionItems = await cartRepository.getCartItems(sessionCartId);

        for (const item of sessionItems) {
            const existingItem = await cartRepository.getCartItemByProductId(userCartId, item.productId);

            if (existingItem) {
                await this.updateItemQuantityByProductId(
                    userCartId,
                    item.productId,
                    existingItem.quantity + item.quantity
                );
            } else {
                await this.addItemToCart(userCartId, item.productId, item.quantity);
            }
        }

        await cartRepository.clearCart(sessionCartId);
    }

    async clearCart(cartId) {
        await cartRepository.clearCart(cartId);
    }

    async getCartItems(cartId) {
        return await cartRepository.getCartItems(cartId);
    }

    async deleteItemByProductId(cartId, productId) {
        await cartRepository.deleteItemByProductId(cartId, productId);
        await cartRepository.updateCartTotal(cartId);
    }

    async updateItemQuantityByProductId(cartId, productId, quantity) {
        await cartRepository.updateItemQuantityByProductId(cartId, productId, quantity);
        await cartRepository.updateCartTotal(cartId);
    }

    async getCartById(cartId) {
        return await cartRepository.getCartById(cartId);
    }

}

export default new CartService();
