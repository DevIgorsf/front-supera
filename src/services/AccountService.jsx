import http from "../http";

class AccountService {
    getAccount(account) {
        return http.get("/conta/" + account );
    }
}

export default new AccountService();

