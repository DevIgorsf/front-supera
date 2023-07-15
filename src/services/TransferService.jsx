import http from "../http";

class TransferService {
    getTransfer(params, data) {
        return http.post("/transferencia/search?"+params, data );
    }
}

export default new TransferService();