import http from "../http";

class TransferService {
    getTransfer(params) {
        return http.get("/transferencia?"+params);
    }

    getTransferSearch(data) {
        return http.post("/transferencia/search", data );
    }
}

export default new TransferService();