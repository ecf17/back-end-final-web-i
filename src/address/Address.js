class Address {
    constructor({ id, user_id, address_line, city, country, created_at, updated_at }) {
        this.id = id;
        this.user_id = user_id;
        this.address_line = address_line;
        this.city = city;
        this.country = country;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

export default Address;
