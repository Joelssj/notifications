"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
// Token.ts
class Token {
    constructor(uuid, userUuid, token, expiresAt, isActive = true) {
        this.uuid = uuid;
        this.userUuid = userUuid;
        this.token = token;
        this.expiresAt = expiresAt;
        this.isActive = isActive;
    }
}
exports.Token = Token;
