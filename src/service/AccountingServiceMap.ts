import { compareSync } from "bcrypt-ts";
import Account from "../model/Account.ts";
import LoginData from "../model/LoginData.ts";
import AccountingService from "./AccountingService.ts";
import JwtUtil from "../security/JwtUtil.ts";

class AccountingServiceMap implements AccountingService {
    private _accounts: Map<string, Account> = new Map();

    constructor() {
        this._accounts.set("admin", {userName: "admin", password: "$2a$10$N82yjQXHhblkQXxALgB0E.zThFGeEtNGjIV2qnQcr0wIYpTogRm/u", role: "ADMIN"}); 
        this._accounts.set("user",  {userName: "user",  password: "$2a$10$HaY2kh2ZVxffEzX1TcuNZ.kbcIrWbLYBHjkdGwzTtNm4Ir72j1Gu.", role: "USER"});
    }

    login(loginData: LoginData): string {
        const account = this._accounts.get(loginData.email);
        
        if (account && compareSync(loginData.password, account.password)) {
            return JwtUtil.getJwt(account);
        }
        throw new Error("Invalid credentials");
    }
}

const accountingService = new AccountingServiceMap();
export default accountingService;