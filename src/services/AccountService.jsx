import http from "../http";

class AccountService {
    getAccount(account) {
        return http.get("/conta/" + account );
    }

    getAccountBalance(account) {
        return http.get("/conta/" + account + "/saldo");
    }
}

export default new AccountService();

