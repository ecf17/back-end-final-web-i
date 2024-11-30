import addressRepository from "./AddressRepository.js";

class AddressService {
    async getAddressesByUser(userId) {
        return await addressRepository.getAddressesByUser(userId);
    }

    async createAddress(userId, addressData) {
        return await addressRepository.createAddress(userId, addressData);
    }

    async updateAddress(addressId, updatedData) {
        return await addressRepository.updateAddress(addressId, updatedData);
    }

    async deleteAddress(addressId) {
        await addressRepository.deleteAddress(addressId);
    }
}

export default new AddressService();
