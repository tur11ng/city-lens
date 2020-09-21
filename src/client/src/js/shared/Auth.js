import Api from "./Api";

let authenticated = false;
let type = null;
let name = null;

export default class Auth {
    static async register(name, email, password) {
        try {
            await Api.register(name, email, password);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async login(email, password) {
        try {
            let res = await Api.login(email, password);
            let {data} = res;

            authenticated = true;
            type = data.type;
            name = data.name;

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async logout() {
        await Api.logout();
        authenticated = false;
        type = null;
        name = null;
    }

    static isAuthenticated() {
        console.log(authenticated);
        return authenticated;
    }

    static isAdmin() {
        return type === "ADMIN";
    }

    static isUser() {
        return type === "USER";
    }

    static getName() {
        return name;
    }
}