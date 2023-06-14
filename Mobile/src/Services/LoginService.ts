import { TokenModel } from "../Models";

class Loginservice {
    private static _instance: Loginservice = null;

    public static getInstance() {
        if (this._instance == null) {
            this._instance = new Loginservice();
        }
        return this._instance;
    }

    public Login(): TokenModel {
        let result = new TokenModel();
        
        return result;
    }
}