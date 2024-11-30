import { handleRequest } from '../core/utils/handleRequest.js';
import addressService from "./AddressService.js";

class AddressController {
    async getAll(req, res) {
        await handleRequest(async (userId) => {
            const addresses = await addressService.getAddressesByUser(userId);
            return { message: "Addresses retrieved successfully", data: addresses };
        }, [req.user.id], res);
    }

    async create(req, res) {
        await handleRequest(async (userId, addressData) => {
            const address = await addressService.createAddress(userId, addressData);
            return { message: "Address created successfully", data: address };
        }, [req.user.id, req.body], res);
    }

    async update(req, res) {
        await handleRequest(async (addressId, updatedData) => {
            const updatedAddress = await addressService.updateAddress(addressId, updatedData);
            return { message: "Address updated successfully", data: updatedAddress };
        }, [req.params.id, req.body], res);
    }

    async delete(req, res) {
        await handleRequest(async (addressId) => {
            await addressService.deleteAddress(addressId);
            return { message: "Address deleted successfully" };
        }, [req.params.id], res);
    }
}

export default new AddressController();