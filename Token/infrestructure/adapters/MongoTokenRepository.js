"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoTokenRepository = void 0;
const Token_1 = require("../../domain/Token");
const mongodb_1 = require("../../../database/mongodb");
class MongoTokenRepository {
    constructor() {
        this.collection = (0, mongodb_1.getMongoDB)().collection('tokens');
        this.usersCollection = (0, mongodb_1.getMongoDB)().collection('users'); // Colección de usuarios
    }
    // Guardar token en la base de datos
    saveToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.collection.insertOne(token);
                console.log(`✅ Token guardado en MongoDB para el usuario con UUID: ${token.userUuid}`);
            }
            catch (error) {
                console.error(`⚠️ Error al guardar el token para el usuario ${token.userUuid}: ${error}`);
                throw new Error("No se pudo guardar el token en la base de datos.");
            }
        });
    }
    // Obtener token activo por UUID del usuario
    getTokenByUserUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`🔍 Buscando token activo para el usuario con UUID: ${userUuid}`);
            try {
                const tokenData = yield this.collection.findOne({ userUuid, isActive: true });
                if (!tokenData) {
                    console.log(`⚠️ No se encontró token activo para el usuario con UUID: ${userUuid}`);
                    return null;
                }
                console.log(`🔍 Token encontrado para el usuario con UUID: ${userUuid} - Token: ${tokenData.token}`);
                return new Token_1.Token(tokenData.uuid, tokenData.userUuid, tokenData.token, tokenData.expiresAt);
            }
            catch (error) {
                console.error(`⚠️ Error al buscar el token para el usuario ${userUuid}: ${error}`);
                throw new Error("No se pudo obtener el token para el usuario.");
            }
        });
    }
    // Desactivar un token
    deactivateToken(tokenValue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.collection.updateOne({ token: tokenValue }, { $set: { isActive: false } });
                console.log(`🚫 Token ${tokenValue} marcado como inactivo en MongoDB`);
            }
            catch (error) {
                console.error(`⚠️ Error al desactivar el token ${tokenValue}: ${error}`);
                throw new Error("No se pudo desactivar el token.");
            }
        });
    }
    // Obtener el correo de un usuario por su UUID
    getUserEmailByUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTokenData = yield this.collection.findOne({ userUuid });
            if (userTokenData && userTokenData.email) {
                return userTokenData.email;
            }
            else {
                console.log(`⚠️ No se encontró el correo para el usuario con UUID: ${userUuid}`);
                return null;
            }
        });
    }
    // Obtener el teléfono de un usuario por su UUID
    getUserPhoneByUuid(userUuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.collection.findOne({ userUuid });
            if (user && user.phone) {
                return user.phone;
            }
            else {
                console.log(`⚠️ No se encontró el teléfono para el usuario con UUID: ${userUuid}`);
                return null;
            }
        });
    }
    // Obtener un token activo por teléfono
    getTokenByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`🔍 Buscando token activo para el teléfono: ${phone}`);
            try {
                const user = yield this.usersCollection.findOne({ phone });
                if (!user) {
                    console.log(`⚠️ No se encontró usuario con el teléfono: ${phone}`);
                    return null;
                }
                const tokenData = yield this.collection.findOne({ userUuid: user.uuid, isActive: true });
                if (!tokenData) {
                    console.log(`⚠️ No se encontró token activo para el usuario con teléfono: ${phone}`);
                    return null;
                }
                console.log(`🔍 Token encontrado para el teléfono ${phone} - Token: ${tokenData.token}`);
                return new Token_1.Token(tokenData.uuid, tokenData.userUuid, tokenData.token, tokenData.expiresAt);
            }
            catch (error) {
                console.error(`⚠️ Error al buscar el token para el teléfono ${phone}: ${error}`);
                throw new Error("No se pudo obtener el token para el teléfono.");
            }
        });
    }
}
exports.MongoTokenRepository = MongoTokenRepository;
/*

// MongoTokenRepository.ts
import { TokenRepository } from "../../domain/TokenRepository";
import { Token } from "../../domain/Token";
import { getMongoDB } from "../../../database/mongodb";

export class MongoTokenRepository implements TokenRepository {
    private collection = getMongoDB().collection('tokens');

    async saveToken(token: Token): Promise<void> {
        await this.collection.insertOne(token);
        console.log(`✅ Token guardado en MongoDB para el usuario con UUID: ${token.userUuid}`);
    }

    async getTokenByUserUuid(userUuid: string): Promise<Token | null> {
        console.log(`🔍 Buscando token activo para el usuario con UUID: ${userUuid}`);
        
        // Buscar el token activo asociado al UUID del usuario
        const tokenData = await this.collection.findOne({ userUuid, isActive: true });
        
        if (!tokenData) {
            console.log(`⚠️ No se encontró token activo para el usuario con UUID: ${userUuid}`);
            return null;
        }
    
        console.log(`🔍 Token encontrado para el usuario con UUID: ${userUuid} - Token: ${tokenData.token}`);
        return new Token(tokenData.uuid, tokenData.userUuid, tokenData.token, tokenData.expiresAt);
    }
    
    async deactivateToken(tokenValue: string): Promise<void> {
        await this.collection.updateOne(
            { token: tokenValue },
            { $set: { isActive: false } }
        );
        console.log(`🚫 Token ${tokenValue} marcado como inactivo en MongoDB`);
    }

    async getUserEmailByUuid(userUuid: string): Promise<string | null> {
        const userTokenData = await this.collection.findOne({ userUuid });
        if (userTokenData && userTokenData.email) {
            return userTokenData.email;
        } else {
            console.log(`⚠️ No se encontró el correo para el usuario con UUID: ${userUuid}`);
            return null;
        }
    }
}

*/ 
