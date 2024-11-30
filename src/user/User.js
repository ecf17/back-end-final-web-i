class User {
    constructor({ id, first_name, last_name, email, password, role }) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.role = role || null;
    }
}

export default User;
